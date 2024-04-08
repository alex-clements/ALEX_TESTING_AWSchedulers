const { handler } = require('../../user/schedule/getOwnSchedule');
const { getPrisma } = process.env.AWS_REGION
? require('/opt/client')
: require('../../../layers/prisma/client_local');

let user;
let prisma

const before = async() =>{
    if (!prisma) prisma = await getPrisma();
   
    user = await prisma.user.findFirst();
    const room = await prisma.room.findFirst();
    console.log(room.id);

    // create booking 1
    let booking = await prisma.booking.create({
        data: {
            organizer: {
                connect: {
                    id: user.id,
                }
            },
            startTime: new Date("2021-08-30T09:00:00"),
            endTime: new Date("2021-08-30T12:00:00"),
            name: "test1",

        }
    });

    console.log(booking.id)

    await prisma.bookingRecord.create({
        data: {
            User: {
                connect: {
                    id: user.id,
                },
            },
            Booking: {
                    connect: {
                        id: booking.id,
                },
            },
            Room: {
                connect: {
                    id: room.id,
                },
            },
        },
    });

    // create booking 2
    booking = await prisma.booking.create({
        data: {
            organizer: {
                connect: {
                    id: user.id,
                }
            },
            startTime: new Date("2021-08-30T18:00:00"),
            endTime: new Date("2021-08-30T19:00:00"),
            name: "test2",
        }
    });

    console.log(booking.id)

    await prisma.bookingRecord.create({
        data: {
            User: {
                connect: {
                    id: user.id,
                },
            },
            Booking: {
                    connect: {
                        id: booking.id,
                },
            },
            Room: {
                connect: {
                    id: room.id,
                },
            },
        },
    });
}

const after = async() =>{
    if (!prisma) prisma = await getPrisma();
    await prisma.booking.deleteMany({
        where: {
            organizerId: user.id
        }
    });

    await prisma.bookingRecord.deleteMany({
        where: {
            userId: user.id
        },
    });
}

const test_pass = async() => {
    try {
        await before();
        let result = await handler({
            requestContext: {
                authorizer: {
                    username: user.username
                }
            },
            queryStringParameters: {
                startDay: "2021-08-30T09:00:00"
            }
        }, null);

        result = JSON.parse(result.body);
        console.log(result);
        await after();
    } catch (err) {
        console.log(err.message);
    }
}

test_pass();

const test_fail_not_monday = async() => {
    try {
        const result = await handler({
            requestContext: {
                authorizer: {
                    username: "sdpwm"
                }
            },
            body: JSON.stringify({
                startDay: "2021-11-30T15:00:00"
            })
        }, null);
        console.log(JSON.parse(result.body));
    } catch (err) {
        console.log(err.message);
    }
}

const test_fail_user_not_exist = async() => {
    try {
        const result = await handler({
            requestContext: {
                authorizer: {
                    username: "sss"
                }
            },
            body: JSON.stringify({
                startDay: "2021-08-30T15:00:00"
            })
        }, null);
        console.log(JSON.parse(result.body));
    } catch (err) {
        console.log(err.message);
    }
}

// test_fail_user_not_exist();
