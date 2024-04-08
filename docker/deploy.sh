cdk deploy --all --require-approval never 2>&1 | tee output.txt
export API_GATEWAY_URL=$(cat output.txt | grep APIGatewayURL | awk '{print $3}')
export USER_POOL_ID=$(cat output.txt | grep UserPoolID | awk '{print $3}')
export USER_POOL_CLIENT_ID=$(cat output.txt | grep UserPoolClientID | awk '{print $3}')
echo "VITE_API_URL=$API_GATEWAY_URL" > aws_vars.txt
echo "VITE_COGNITO_USER_POOL_ID=$USER_POOL_ID" >> aws_vars.txt
echo "VITE_COGNITO_CLIENT_ID=$USER_POOL_CLIENT_ID" >> aws_vars.txt