const baseUrl = 'http://localhost:3001';

async function runTrade() {
    try {
        console.log("--- DEBUG MODE STARTED ---");

        // 1. REGISTER
        const uniqueUser = 'user_' + Math.floor(Math.random() * 100000);
        console.log(`1. Registering user: ${uniqueUser}...`);
        
        const regRes = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: uniqueUser,
                email: `${uniqueUser}@test.com`,
                password: 'password123'
            })
        });
        const regText = await regRes.text(); 
        console.log(`   -> Register Status: ${regRes.status}`);
        console.log(`   -> Server Said: ${regText}`);

        // 2. LOGIN
        console.log("2. Logging in...");
        const loginRes = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: `${uniqueUser}@test.com`,
                password: 'password123'
            })
        });
        
        const loginData = await loginRes.json();
        const token = loginData.token;

        // CRITICAL CHECK: Did we actually get a token?
        if (!token) {
            console.error("\n!!! STOP !!! Login Failed.");
            console.error("The server did not give us a token. It returned:", loginData);
            return;
        }
        console.log(`   -> Token Acquired: ${token.substring(0, 15)}...`);

        // 3. CREATE PORTFOLIO
        console.log("3. Creating Portfolio...");
        const portRes = await fetch(`${baseUrl}/portfolios`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: "Debug Portfolio" })
        });
        
        const portText = await portRes.text();
        console.log(`   -> Portfolio Status: ${portRes.status}`);
        
        if (portRes.status !== 201 && portRes.status !== 200) {
            console.error(`   -> FAILED. Server message: ${portText}`);
            return;
        }

        const portData = JSON.parse(portText);
        console.log(`   -> SUCCESS! Portfolio ID: ${portData.id}`);

        // 4. BUY STOCK
        console.log("4. Buying Stock...");
        const buyRes = await fetch(`${baseUrl}/trades/buy`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                portfolioId: portData.id,
                symbol: 'AAPL',
                quantity: 10
            })
        });
        const buyText = await buyRes.text();
        console.log("\nFINAL TRADE RESULT:");
        console.log(buyText);

    } catch (error) {
        console.error("SCRIPT ERROR:", error);
    }
}

runTrade();