const { handler } = require('../../algo/bookingOptions/getBookingOptions');


const test = async() => {
    try {
        const result = await handler({
            body: JSON.stringify({
                startTime: new Date("2021-08-30T15:00:00"),
                endTime: new Date("2021-08-30T16:00:00"),
                users: ["clu0qqf0o009vcfwf2jb58qpf","clu0qqf0o00a6cfwfymuwog69","clu0qqeyh0017cfwfkrx58gik"],
                AV: true,
                VC: true
            })
        }, null);

        console.log(JSON.parse(result.body));
    } catch (err) {
        console.log(err.message);
    }

}

test();