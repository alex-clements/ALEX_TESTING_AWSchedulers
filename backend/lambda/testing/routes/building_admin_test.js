const { handler } = require('../../admin/buildings/manipulateBuildings_admin');
const { getPrisma } = process.env.AWS_REGION
? require('/opt/client')
: require('../../../layers/prisma/client_local');
let prisma;

let building = "cltevq5g40000mxiwpg65sudw";

const getBuilding = async() => {
	try {
		if (!prisma) prisma = await getPrisma();
		const result = await prisma.building.findFirst();
		building = result.id;
	} catch (err) {
		console.log(err.message);
	}
}

const post_test = async() => {
    try {
		let data = {
			airportCode: "YVR",
			number: 45,
			maxFloor: 5,
			longitude: 66677788,
			latitude: 66677798,
			location: "your place",
		}

        const result = await handler({
			body: JSON.stringify(data),
			httpMethod: "POST"
		}, null);

		console.log(JSON.parse(result.body));
    } catch (err) {
        console.log(err.message);
    }
}

const put_test = async() => {
	try {
		await getBuilding();
		let data = {
			number: 66666
		}

		const result = await handler({
			body: JSON.stringify(data),
			queryStringParameters: {
				id: building
			},
			httpMethod: "PUT"
		}, null);

		console.log(JSON.parse(result.body));
	} catch (err) {
		console.log(err.message);
	}
}

const get_test = async() => {
	try {
		let data = {
			location: "my place",
		}

		const result = await handler({
			body: JSON.stringify(data),
			queryStringParameters: {
				id: building
			},
			httpMethod: "GET"
		}, null);

		console.log(JSON.parse(result.body));
	} catch (err) {
		console.log(err.message);
	}
}

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

put_test();


/*
"
Invalid `prisma.building.findUnique()` invocation in
C:\\Users\\whoie\\IdeaProjects\\UBC\\AWS-AWSchedulers\\backend\\lambda\\admin\\buildings\\manipulateBuildings_admin.js:80:52

  77   number = building.number;
  78 } 
  79 
→ 80 const duplicatedBuilding = await prisma.building.findUnique({
       where: {
         AND: [
           {
             airportCode: \"YVR\"
           },
           {
             number: 55555
           }
         ],
     ?   id?: String,
     ?   OR?: BuildingWhereInput[],
     ?   NOT?: BuildingWhereInput | BuildingWhereInput[],
     ?   airportCode?: StringFilter | String,
     ?   number?: IntFilter | Int,
     ?   longitude?: FloatFilter | Float,
     ?   latitude?: FloatFilter | Float,
     ?   location?: StringFilter | String,
     ?   maxFloor?: IntFilter | Int,
     ?   rooms?: RoomListRelationFilter,
     ?   users?: UserListRelationFilter
       }
     })

Argument `where` of type BuildingWhereUniqueInput needs at least one of `id` arguments. Available options are marked with ?."
*/