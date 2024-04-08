// const { handler } = require('../../admin/users/manipulateUsers_admin');
const { getPrisma } = process.env.AWS_REGION
? require('/opt/client')
: require('../../../layers/prisma/client_local');

let prisma;

let building, user;

const before = async() => {
	try {
		if (!prisma)	prisma = await getPrisma();
		let result = await prisma.building.findFirst();
		building = result.id;

		result = await prisma.user.findFirst();
		user = result.id;
	} catch (err) {
		console.log(err.message);
	}
}

const post_test = async() => {
    try {
		await before();

        const result = await prisma.user.create({
            data: {
                Building: {
                    connect: {
                        id: building
                    }
                },
				username: "testt2",
				name: "Test2",
				floorNumber: 4,
            }
          });

        console.log(result);
    } catch (err) {
        console.log(err.message);
    }
}

const hash_test = async () => {
	const key = "username".charCodeAt(0);

  const password = "username" + key.toString() + "@AMAZON69";
  const hashedPassword = password
    .split('')
    .map((char) => (char.charCodeAt(0) * key).toString(16))
    .join("")

	console.log(hashedPassword);
}

hash_test();

const put_test = async() => {
	try {
        await before();

        const result = await prisma.user.update({
            where: {
              id: user,
            },
            data: {
                email: "acv"
            }
          });

          console.log(result);
	} catch (err) {
		console.log(err.message);
	}
}

const put_test = async() => {
	try {
		await before();

		let data = {

			email: "my place",
		};

		let queryStringParameters = {
			id: user
		};

		const result = await handler({
			queryStringParameters: queryStringParameters,
			body: JSON.stringify(data),
			httpMethod: "PUT"
		}, null);

		console.log(JSON.parse(result.body));
	} catch (err) {
		console.log(err.message);
	}
}

const get_test = async() => {
	try {
		const result = await handler({
			queryStringParameters: {
				id: user
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
