const { getPrisma } = process.env.AWS_REGION
? require('/opt/client')
: require('../../../layers/prisma/client_local');

const { 
    getAvailabilityRequest,
    handleError
} = process.env.AWS_REGION
? require('/opt/dist/client')
: require('../../../layers/zod/dist/client');

let prisma;
let headers = {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*'
};

const HOUR_TIMESTAMP = 60 * 60 * 1000;

exports.handler = async function (event, context) {
    try {

        if (!prisma) prisma = await getPrisma();

        // users should be a list of user id 
        const body = event?.body ? JSON.parse(event?.body) : {};
        const organizer = event.requestContext.authorizer.username;
        const organizerId = await getOrganizerId(organizer);

        const data = getAvailabilityRequest.parse(body);
        // adding organizer to the list of attendees
        let attendees = new Set(data.users);
        attendees.add(organizerId);
        data.users = Array.from(attendees);

        // convert YYYY-MM-DDTHH:MM:SS.SSSZ to Date
        let startDay = new Date(data.startDay);
        const currentDay = new Date(data.currentDay);
        
        const endDay = new Date(startDay.getTime() + (110 * HOUR_TIMESTAMP));

        if (endDay < currentDay) {
            return {
                "statusCode": 200,
                "headers": headers,
                "body": JSON.stringify({ result: [] })
            };
        } else if (startDay < currentDay) {
            startDay = currentDay;
        } 

        const sortedBookings = await getUsersBookings(data.users, startDay, endDay);
        const aggregatedAvailabilities = getAggregatedAvailabilities(sortedBookings, startDay, endDay);
        // const result = createResult(aggregatedAvailabilities, startDay);
        
        return {
            "statusCode": 200,
            "headers": headers,
            "body": JSON.stringify({ result: aggregatedAvailabilities })
        };
    } catch (err) {
        const error = handleError(err);
        return {
        statusCode: error.status,
        headers: headers,
        body: JSON.stringify({ error: error.error })
        };
    }
}

const getOrganizerId = async (organizer) => {
    const user = await prisma.user.findUnique({
        where: {
            username: organizer
        },
        select: {  
            id: true
        }
    });
    return user.id;
}

function getAggregatedAvailabilities(sortedBookings, startDay, endDay) {
    let aggregatedAvailabilities = [];

    // if no bookings, then the whole week is available
    if (sortedBookings.length === 0) {
        const availableDays = getDaysInBetween(startDay, endDay);
        aggregatedAvailabilities = aggregatedAvailabilities.concat(availableDays);
        return aggregatedAvailabilities;
    }

    // if the first booking starts after the startDay, then the time from startDay -> first booking is available
    if (sortedBookings[0].startTime > startDay) {
        const availableDays = getDaysInBetween(startDay, sortedBookings[0].startTime);
        aggregatedAvailabilities = aggregatedAvailabilities.concat(availableDays);
    }

    // iterate through the bookings and find the available times
    let currentBooking = 0;
    let nextBooking = 1;
    let latestTimestamp = sortedBookings[currentBooking].endTime;
    while (currentBooking < nextBooking && nextBooking < sortedBookings.length) {
        // keep track of the latest timestamp
        if (sortedBookings[nextBooking].endTime > latestTimestamp) {
            latestTimestamp = sortedBookings[nextBooking].endTime;
        }

        // if next booking is within the current booking but last longer, then the update the current booking
        if (sortedBookings[nextBooking].endTime > sortedBookings[currentBooking].endTime && sortedBookings[nextBooking].startTime <= sortedBookings[currentBooking].endTime) {
            currentBooking = nextBooking;
        // else if there's gap between the current booking and the next booking, then the time between the two bookings is available
        } else if (sortedBookings[nextBooking].startTime > sortedBookings[currentBooking].endTime) {
            const availableDays = getDaysInBetween(sortedBookings[currentBooking].endTime, sortedBookings[nextBooking].startTime);
            aggregatedAvailabilities = aggregatedAvailabilities.concat(availableDays);
            currentBooking = nextBooking;
        }
        nextBooking++;
    }
    
    // if the latest timestamp is before the endDay, then the latest timestamp -> endDay is available
    if (latestTimestamp < endDay) {
        const availableDays = getDaysInBetween(latestTimestamp, endDay);
        aggregatedAvailabilities = aggregatedAvailabilities.concat(availableDays);
    }

    return aggregatedAvailabilities;
}

const getUsersBookings = async (users, startDay, endDay) => {
    const usersBookings = await prisma.user.findMany({
        where: {
            id: {
                in: users
            }
        },
        select:{
            BookingRecords: {
                where: {
                    AND: [
                        { Booking: { startTime: { gte: startDay } } },
                        { Booking: { endTime: { lte: endDay } } }
                    ]
                },
                select:{
                    Booking: {
                        select: {
                            startTime: true,
                            endTime: true
                        }
                    }
                }
            }
        }
    });

    // convert list of bookings of list of users to list of bookings (2d to 1d array)
    let sortedBookings = [];
    usersBookings.map((userBookings) => {
        userBookings.BookingRecords.map((record) => {
            sortedBookings.push(record.Booking);
        });
    });

    // sort the bookings by start time
    sortedBookings.sort((a, b) => a.startTime - b.startTime);
    return sortedBookings
}

function getDaysInBetween(startDate, endDate) {
    let daysDate = [];
    let sod = new Date(startDate);
    let eod = new Date(sod);
    eod.setDate(eod.getDate() + 1);
    eod.setHours(3, 0, 0);

    while (eod < endDate) {
        daysDate.push({
            startTime: sod,
            endTime: eod
        });
        sod = new Date(sod);
        sod.setDate(sod.getDate() + 1);
        sod.setHours(13, 0, 0);
        eod = new Date(eod);
        eod.setDate(eod.getDate() + 1);
    }
    daysDate.push({
        startTime: sod,
        endTime: endDate
    })

    return daysDate;
}

// function parseDateToString(date) {
//     const year = date.getFullYear().toString();
//     let month = (date.getMonth() + 1).toString();
//     month = month < 10 ? "0" + month : month;
//     let day = date.getDate().toString();
//     day = day < 10 ? "0" + day : day;
//     return year + "-" + month + "-" + day;
// }

// function createResult(availability, startDay) {
//     const eod = [];
//     let day = new Date(startDay);
//     for (let i = 0; i < 5; i++) {
//         day = new Date(day);
//         day.setDate(day.getDate() + 1);
//         day.setHours(20, 0, 0);
//         eod.push(day);
//     }

//     let result = [{
//         "date": parseDateToString(startDay),
//         "day": "MON",
//         "timeslots": []
//     },
//     {
//         "date": parseDateToString(eod[0]),
//         "day": "TUE",
//         "timeslots": []
//     },{
//         "date": parseDateToString(eod[1]),
//         "day": "WED",
//         "timeslots": []
//     },{
//         "date": parseDateToString(eod[2]),
//         "day": "THUR",
//         "timeslots": []
//     },{
//         "date": parseDateToString(eod[3]),
//         "day": "FRI",
//         "timeslots": []
//     }];

//     let currentEOD = 0;
//     for (let i = 0; i < availability.length; i++) {
//         if (availability[i].startTime < eod[currentEOD]) {
//             result[currentEOD].timeslots.push(availability[i]);
//         } else {
//             while (availability[i].startTime > eod[currentEOD] && currentEOD < 5) {
//                 currentEOD++;
//             }
//             result[currentEOD].timeslots.push(availability[i]);
//         }
//     }
//     return result;
// }