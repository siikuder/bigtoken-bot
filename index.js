/*
Script created by Wildan F
*/
const rp = require('request-promise');
const randomstring = require('randomstring');
const inquirer = require('inquirer');
const random_ua = require('random-ua');
const delay = require('delay');
const S = require('string');

async function generateData() {
    try {
        const cURL = await rp({
            url: 'https://randomuser.me/api/?nat=us',
            method: 'GET',
            json: true
        });
        return {
            name: `${cURL.results[0].name.first} ${cURL.results[0].name.last}`,
            gender: `${cURL.results[0].gender}`,
            email: `${cURL.results[0].email.replace('@example.com', '')}`
        };
    } catch(err) {
        return err;
    }
}

async function registerBigToken(email, referral) {
    try {
        const cURL = await rp({
            url: 'https://api.bigtoken.com/signup',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-Client-ID': 'WW1GelpUWTBPbnBFY1hBMFVrTnNWbUZ4VTNsbFVHSnVlV3BTWm1rd1JrWkhlbHBxWm5OaFVsWjJhM3BhUkhocloyczk=',
                'User-Agent': 'BIGtoken/1.0.6.2 Dalvik/2.1.0 Linux; U; Android 8.1.0; 4b0e5fe4484d2ea6 Build/25',
                'Content-Type': ' application/x-www-form-urlencoded'
            },
            form: {
                email: email,
                password: "Lolipop1902@",
                referral_id: referral,
                monetize: 1
            }
        });
        return cURL;
    } catch(err) {
        return err;
    }
}

(async function() {
    const qx = await inquirer.prompt([{
        type: 'input',
        name: 'referral',
        message: 'Enter your referral',
        validate:function(data) {
            if(!data) return 'Can\'t empty';
            return true;
        }
    },{
        type: 'input',
        name: 'looping',
        message: 'Enter looping',
        validate:function(data){
            if(!data) return 'Can\'t empty';
            return true;
        }

    }])
    let i = 1;
    while(i <= qx.looping) {
        i++;
        const doGetData = await generateData();
        let emailVerified = ['sikuder.me'];
        emailVerified = emailVerified[Math.floor(Math.random() * emailVerified.length)];
        try {
            let cURL = await rp({
                url: 'https://generator.email/email-generator',
                method: 'POST',
                headers: {
                    'User-Agent' : await random_ua.generate(),
                    'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language' : 'en-US,en;q=0.5',
                    'Cookie' : 'surl='+emailVerified+'/'+doGetData.email+'/; _ga=GA1.2.1971437269.1554693562; _gid=GA1.2.75263414.1554693562; _gat=1; io=TpY6L8Z9S0ZVVk92PZF4'
                }
            });
        } catch(err) {
            if(err.statusCode === 302) {
                console.log(`[!] Creating email.`);
            }
        }
        console.log(`[!] Email : ${doGetData.email}@${emailVerified}`);
        const doRegister = await registerBigToken(doGetData.email+`@${emailVerified}`, qx.referral);
        if(doRegister.indexOf('user_id') > -1 && doRegister != "") {
            console.log(`[!] Register success, reading email.`);

            let dapet = true;
            let linknya;
            while(dapet) {
                try {
                    cURL = await rp({
                        url: 'https://generator.email/inbox2/',
                        method: 'POST',
                        headers: {
                            'User-Agent' : await random_ua.generate(),
                            'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                            'Accept-Language' : 'en-US,en;q=0.5',
                            'Cookie' : 'surl='+emailVerified+'/'+doGetData.email+'/; _ga=GA1.2.1971437269.1554693562; _gid=GA1.2.75263414.1554693562; _gat=1; io=TpY6L8Z9S0ZVVk92PZF4'
                        }
                    });
                    if(cURL.indexOf('gobigtoken') > -1) {
                        linknya = S(cURL).between('oration: none" href="', '" ').s;
                        dapet = false;
                    }
                } catch(err) {
                    dapet = false;
                    console.log(`[!] Error get inbox.`);
                }
            }
            try {
                cURL = await rp({
                    url: linknya,
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.5'
                    },
                    simple: false,
                    resolveWithFullResponse: true
                });
                const getLinks = cURL.request.href;
                if(getLinks.indexOf('verify?code=') > -1) {
                    const verifyCode = S(getLinks).between('verify?code=', '&type=').s;
                    try {
                        cURL = await rp({
                            url: 'https://api.bigtoken.com/signup/email-verification',
                            method: 'POST',
                            headers: {
                                'User-Agent' : await random_ua.generate(),
                                'Accept' : 'application/json'
                            },
                            form: {
                                email: `${doGetData.email}@${emailVerified}`,
                                verification_code: `${verifyCode}`
                            }
                        });
                        if(cURL.indexOf('"reward":true') > -1) {
                            console.log(`[>] Success!\n`);
                        } else {
                            console.log(`[!] Manual verification.\n`);
                        }
                    } catch(err) {
                        console.log(`${err}`);
                    }
                } else {
                    console.log(`[!] Gagal vefifikasi.\n`);
                }
            } catch(err) {
                console.log(err);
            }
        } else {
            console.log(`[?] Failed to register. ${doGetData.email}@${emailVerified}\n`);
        }
    }
})();