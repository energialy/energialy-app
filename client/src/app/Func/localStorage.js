export default function getLocalStorage(){
    if(typeof window !== "undefined"){
        try {
            const userD = sessionStorage.getItem("user");
            if (!userD) return null;
            const user = JSON.parse(userD);
            return user;
        } catch (error) {
            console.error('Error parsing user data from sessionStorage:', error);
            return null;
        }
    }
    return null;
}
   
