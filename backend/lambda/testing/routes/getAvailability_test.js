const { handler } = require('../../algo/attendeesAvailability/getAttendeesAvailability');

const { getPrisma } = process.env.AWS_REGION
? require('/opt/client')
: require('../../../layers/prisma/client_local');

let userA;
let userB;
let prisma

const beforeA = async() =>{
    if (!prisma) prisma = await getPrisma();
   
    userA = await prisma.user.findFirst();
    
    const room = await prisma.room.findFirst();
    console.log(room.id);

    // create booking 1
    let booking = await prisma.booking.create({
        data: {
            organizer: {
                connect: {
                    id: userA.id,
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
                    id: userA.id,
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
                    id: userA.id,
                }
            },
            startTime: new Date("2021-09-01T14:00:00"),
            endTime: new Date("2021-09-01T15:30:00"),
            name: "test2",
        }
    });

    console.log(booking.id)

    await prisma.bookingRecord.create({
        data: {
            User: {
                connect: {
                    id: userA.id,
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

const beforeB = async() =>{
    if (!prisma) prisma = await getPrisma();
   
    userB = await prisma.user.findFirst({
        skip: 1
    });
    
    const room = await prisma.room.findFirst();
    console.log(room.id);

    // create booking 1
    let booking = await prisma.booking.create({
        data: {
            organizer: {
                connect: {
                    id: userB.id,
                }
            },
            startTime: new Date("2021-08-30T11:00:00"),
            endTime: new Date("2021-08-30T14:00:00"),
            name: "test1",

        }
    });

    console.log(booking.id)

    await prisma.bookingRecord.create({
        data: {
            User: {
                connect: {
                    id: userB.id,
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
                    id: userB.id,
                }
            },
            startTime: new Date("2021-09-01T14:00:00"),
            endTime: new Date("2021-09-01T15:00:00"),
            name: "test2",
        }
    });

    console.log(booking.id)

    await prisma.bookingRecord.create({
        data: {
            User: {
                connect: {
                    id: userB.id,
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
            organizerId: userA.id
        }
    });

    await prisma.bookingRecord.deleteMany({
        where: {
            userId: userA.id
        },
    });

    await prisma.booking.deleteMany({
        where: {
            organizerId: userB.id
        }
    });

    await prisma.bookingRecord.deleteMany({
        where: {
            userId: userB.id
        },
    });
}

const test = async() => {
    try {
        await beforeA();
        await beforeB();

        const result = await handler({
            body: JSON.stringify({
                startDay: "2021-08-30T15:00:00", // hour min second shouldn't matter
                users: [userA.id, userB.id]
            })
        }, null);

        const body = JSON.parse(result.body);
        console.log(body);
        const date = new Date(body.result[0].startTime);
        console.log(date);
        console.log(date.toLocaleTimeString());
        console.log(date.toLocaleDateString());
        await after();
    } catch (err) {
        console.log(err.message);
    }

}

test();