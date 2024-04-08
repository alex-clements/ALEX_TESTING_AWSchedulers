const { handler } = require('../lambda/algo/bookingOptions/getBookingOptions');
const { getPrisma } = require('../layers/prisma/client_local')

const test = async () => {
  try {
    const result = await handler({
      body: JSON.stringify(
        {
          startTime: "2024-04-05T14:00:00.000Z",
          endTime: "2024-04-05T15:00:00.000Z",
          replaceMeeting: false,
          users: [
            "cluozbkqs009vlizcvdmj8tf6",
            "cluozbkqs009wlizcc3uur32a",
            "cluozbkqs009xlizcwnqzpry9",
          ],
          AV: true,
          VC: true,
          singleRoom: false
        }
      ),
      requestContext: {
        authorizer: {
          username: "BookingUser1"
        }
      }
    }, null);

    console.log(JSON.parse(result.body));
  } catch (err) {
    console.log(err.message);
  }

}

test();