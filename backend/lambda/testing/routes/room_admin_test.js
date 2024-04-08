const { handler } = require('../../admin/rooms/manipulateRooms_admin');
const { getPrisma } = process.env.AWS_REGION
? require('/opt/client')
: require('../../../layers/prisma/client_local');

let building
let orBuilding
let room

const before = async() =>{
    const prisma = await getPrisma();
   
    const b = await prisma.building.findFirst();
    building = b.id;
    const r = await prisma.room.findFirst({
        where:{
            NOT:{
                buildingId: building
            }
        }
    });
    room = r.id;
    console.log(r.buildingId)
}

const post_test = async() => {
    try {
		await before();
		let data = {

		}

        const result = await handler({
			queryStringParameters: {
				id: room
			},
			body: JSON.stringify(data),
			httpMethod: "POST"
		}, null);

		console.log(JSON.parse(result.body));
    } catch (err) {
        console.log(err.message);
    }
}

post_test();

const get_test = async() => {
	try {
		const result = await handler({
			queryStringParameters: {
				id: room
			},
			httpMethod: "GET"
		}, null);

		console.log(JSON.parse(result.body));
	} catch (err) {
		console.log(err.message);
	}
}


const put_test = async() => {
    await before();

	try {
        const prisma = await getPrisma();
        const result = await prisma.room.update({
            where: {
              id: room,
            },
            data: {
                Building:{
                    connect: {id: building}
                }
            }
          });
  
          console.log(result);

		// let data = {
        //     capacity: 4,
        //     Building: building,
        //     AV: false,
		// }

        // const result = await handler({
		// 	body: JSON.stringify(data),
		// 	queryStringParameters: {
		// 		id: room
		// 	},
		// 	httpMethod: "PUT"
		// }, null);

		// console.log(JSON.parse(result.body));
	} catch (err) {
		console.log(err.message);
	}
}


// put_test();

const delete_test = async() => {
	try {
		let data = {
			location: "my place",
		}

		const result = await handler({
			body: JSON.stringify(data),
			queryStringParameters: {
				id: building
			},
			httpMethod: "DELETE"
		}, null);

		console.log(JSON.parse(result.body));
	} catch (err) {
		console.log(err.message);
	}
}

const put_test_fail = async() => {
	try {
		let data = {
			location: "my place",
		}

		const result = await handler({
			body: JSON.stringify(data),
			httpMethod: "PUT"
		}, null);

		console.log(JSON.parse(result.body));
	} catch (err) {
		console.log(err.message);
	}
}
