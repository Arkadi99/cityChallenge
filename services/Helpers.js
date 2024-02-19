import axios from "axios";

class Helpers {
    static randomString = (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    static googleLogin = async (googleToken) => {
        return await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {params: {access_token: googleToken}}).then(res=>{
            console.log(res);
        })
    }
    static googleLogin2 = async (accessToken) => {
        try {
            // Make a request to the Google userinfo endpoint to retrieve user information
            const response = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            return response.data
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
}

export default Helpers
