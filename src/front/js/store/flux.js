const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            demo: [
                {
                    title: "FIRST",
                    background: "white",
                    initial: "white"
                },
                {
                    title: "SECOND",
                    background: "white",
                    initial: "white"
                }
            ]
        },
        actions: {
            // Function to change color in the demo array
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            // Fetch message from the backend
            getMessage: async () => {
                try {
                    // Use the environment variable for the backend URL or fall back to localhost
                    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
                    console.log("Fetching from:", backendUrl);

                    // Fetching data from the backend, include the endpoint
                    const resp = await fetch(`${backendUrl}/api/hello`);  // Change '/api/hello' 
                   
                    // Manejo de la respuesta
                    if (!resp.ok) {
                        throw new Error('Network response was not ok. Status: ' + resp.status);
                    }

                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.error("Error loading message from backend:", error);
                }
            },

            // Function to change the color of an item in the demo array
            changeColor: (index, color) => {
                const store = getStore();

                // Update the demo array
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });

                // Update the store with the modified demo array
                setStore({ demo: demo });
            }
        }
    };
};

export default getState;
