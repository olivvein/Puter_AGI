//appTitle: Puter AI Assistant

import React, { useState, useEffect } from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import { setup as twindSetup } from 'https://cdn.skypack.dev/twind/shim';

twindSetup();


const systemPrompt = `
You are a pro developer in javascript and puter.
You allways respond to user in one run.
You only create js code.
Don't write in md format. Just write pure executable code with no talk or explaination
You only provide code. no explaination, no title, no comment. 

if request to talk or to speak : 

const audio=await puter.ai.txt2speech("the text to speak");
audio.play();

if request to show username : 

const user=await puter.auth.getUser();
return user.username;

to make an image :
const image=await puter.ai.txt2img('description of the image');

if a result is expected, you must always return the result
for function, return the fuction output like that 

function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

return fibonacci(5);



only respond executable js code
always return a beautiful html formatted using tailwind
never produce md code snipet. always pure js code



`;








const AiAssistant = () => {
    const [userInput, setUserInput] = useState('');
    const [response, setResponse] = useState('');

    const systemMessage = {
        role: "system",
        content: systemPrompt
    };

    function executeCode(code) {
        return new Promise((resolve, reject) => {
            try {
                const asyncFunction = async function () {
                    try {
                        const result = await eval(`(async () => {${code}})()`);
                        return result;
                    } catch (error) {
                        throw error;
                    }
                };

                asyncFunction()
                    .then(result => {
                        resolve(result);
                    })
                    .catch(error => {
                        reject(error);
                    });
            } catch (error) {
                reject(error);
            }
        });
    }

    const handleExecute = async () => {
        try {
            // Evaluate the response (JavaScript code returned by AI)
            // eslint-disable-next-line no-eval
            console.log("Execution of code :");
            console.log(response);
            executeCode(response)
                .then(result => {
                    console.log("Result :");
                    console.log(result);
                    if(result){
                        setResponse(result)
                    }
                    
                    // Output: { greeting: 'Hello, John!', data: 'Data fetched successfully' }
                })
                .catch(error => {
                    console.error(error);
                });



        } catch (error) {
            console.error('Error executing response code:', error);
        }
    };

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const messageList = [
            systemMessage,
            { role: "user", content: userInput },
        ];

        try {
            const chatResponse = await puter.ai.chat(messageList);
            setResponse(chatResponse.toString());

            // Append the AI's response to the messageList for history
            const toAppend = { role: "assistant", content: chatResponse.toString() };
            messageList.push(toAppend);
        } catch (error) {
            console.error('Error getting response from AI:', error);
        }
    };

    useEffect(() => {
        if (response) {
            handleExecute();
        }
    }, [response]);

    return (
        <div className="flex flex-col h-full justify-between bg-dark text-light">
            <header className="p-4 shadow-lg bg-gray-800 text-white">Puter AGI</header>
            <div className="flex-grow p-4">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <textarea
                        className="p-2 rounded bg-gray-700 text-white"
                        placeholder="Type your request here..."
                        value={userInput}
                        onChange={handleInputChange}
                    ></textarea>
                    <button
                        type="submit"
                        className="self-end px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors"
                    >Ask</button>
                </form>
                <div className="mt-4">
                    <h2 className="text-lg">AI Response:</h2>
                    <div className="bg-gray-700 p-4 rounded" dangerouslySetInnerHTML={{__html: response}}></div>
                </div>
            </div>
            <footer className="fixed w-full bottom-0 p-4 bg-gray-800 text-white flex justify-center">
               <span>Made with <span className="text-red-600">♥️</span> with <a >Code With AI</a></span>
            </footer>
        </div>
    );
};

ReactDOM.render(<AiAssistant />, document.getElementById("app"));
