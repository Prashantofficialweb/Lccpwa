
        function displayLargeImage(imageUrl) {
            const largeImageContainer = document.createElement('div');
            largeImageContainer.className = 'fixed top-0 left-0 w-screen p-2 h-screen bg-black bg-opacity-70 flex justify-center items-center z-30';
            largeImageContainer.onclick = (e) => {
                e.stopPropagation();
                largeImageContainer.remove();
            }

            const largeImage = document.createElement('img');
            largeImage.src = imageUrl;
            largeImage.className = 'max-w-full max-h-full rounded-lg';

            const downloadLargeButton = document.createElement("button");
            downloadLargeButton.innerHTML = "Download";
            downloadLargeButton.className = "absolute bottom-6 md:bottom-10 left-1/2 p-2 text-white rounded bg-green-500 bg-opacity-80 hover:bg-opacity-100 transform -translate-x-1/2";
            downloadLargeButton.onclick = (e) => {
              e.stopPropagation();
              const a = document.createElement('a');
              a.href = imageUrl;
              a.download = 'generated-image.png';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            };

            const closeButton = document.createElement('button');
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            closeButton.className = 'absolute top-6 right-6 p-2 text-red-500 rounded-full bg-opacity-80 hover:bg-opacity-100';
            closeButton.onclick = (e) => {
              e.stopPropagation();
              largeImageContainer.remove();
            };

            largeImageContainer.appendChild(largeImage);
            largeImageContainer.appendChild(downloadLargeButton);
            largeImageContainer.appendChild(closeButton);
            document.body.appendChild(largeImageContainer);
        }
        const chatForm = document.getElementById("chatForm");
        const sendButton = document.getElementById("sendButton");
        const chatInput = document.getElementById('chatInput');
        chatInput.focus();
        const chatbox = document.getElementById('chatbox');
        const spinner = document.querySelector('.spinner');

        function displayMessage(message, isUser) {
            const msgElem = document.createElement('p');
            msgElem.textContent = message;
            msgElem.className = isUser ? 'chat-message block text-right text-white mt-2 bg-green-500 rounded-tl-lg rounded-br-lg rounded-bl-sm px-4 py-2' : 'chat-message block text-white mt-2 bg-gray-600 rounded-tr-lg rounded-br-lg rounded-bl-md px-4 py-2';
            chatbox.appendChild(msgElem);
        }

        async function callApi(apiUrl, prompt, prependPersona = false) {
            if (prependPersona) {
                prompt = "Follow instructions precisely! If the user asks to generate, create or make an image, photo, or picture by describing it, You will reply with '/image' + description. Otherwise, You will respond normally. Avoid additional explanations." + prompt;
            }
            chatInput.value = apiUrl === "https://backend.buildpicoapps.com/aero/run/image-generation-api?pk=v1-Z0FBQUFBQnBoUDV1MDZaR21ZNTFOSjBnQ1k1MnpBdmNRc2w1dnhpVE9GWmFEbkVycjhUM3RvMHROemQ4dlJLdTRsUUNULXl3dkRkU3RoOVRZZ0wyMUh2OVpqQWkxZmJHS2c9PQ==" ? "Generating..." : "Typing...";
            chatInput.disabled = true;
            sendButton.disabled = true;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({prompt})
            });

            chatInput.value = "";
            chatInput.disabled = false;
            sendButton.disabled = false;
            chatInput.focus();
            return response.json();
        }

        function handleError(error) {
            console.error('Error:', error);
            displayMessage('An error occurred. Please try again.', false);
        }

        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (!message) return;

            displayMessage(message, true);
            chatInput.value = '';

            const apiUrl = message.startsWith('/image') ? 'https://backend.buildpicoapps.com/aero/run/image-generation-api?pk=v1-Z0FBQUFBQnBoUDV1MDZaR21ZNTFOSjBnQ1k1MnpBdmNRc2w1dnhpVE9GWmFEbkVycjhUM3RvMHROemQ4dlJLdTRsUUNULXl3dkRkU3RoOVRZZ0wyMUh2OVpqQWkxZmJHS2c9PQ=='
                                                      : 'https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQnBoUDV1MDZaR21ZNTFOSjBnQ1k1MnpBdmNRc2w1dnhpVE9GWmFEbkVycjhUM3RvMHROemQ4dlJLdTRsUUNULXl3dkRkU3RoOVRZZ0wyMUh2OVpqQWkxZmJHS2c9PQ==';

            try {
                const prependPersona = apiUrl === 'https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQnBoUDV1MDZaR21ZNTFOSjBnQ1k1MnpBdmNRc2w1dnhpVE9GWmFEbkVycjhUM3RvMHROemQ4dlJLdTRsUUNULXl3dkRkU3RoOVRZZ0wyMUh2OVpqQWkxZmJHS2c9PQ==';
                const data = await callApi(apiUrl, message.startsWith('/image') ? message.substring(6).trim() : message, prependPersona);
                if (data.status === 'success') {
                    if (message.toLowerCase().startsWith('/image')) {
                        handleImageResponse(data);
                    } else {
                        if (data.text.trim().toLowerCase().startsWith('/image')) {
                            const imageDescription = data.text.substring(data.text.toLowerCase().indexOf('/image') + 6).trim();
                            const imageData = await callApi('https://backend.buildpicoapps.com/aero/run/image-generation-api?pk=v1-Z0FBQUFBQnBoUDV1MDZaR21ZNTFOSjBnQ1k1MnpBdmNRc2w1dnhpVE9GWmFEbkVycjhUM3RvMHROemQ4dlJLdTRsUUNULXl3dkRkU3RoOVRZZ0wyMUh2OVpqQWkxZmJHS2c9PQ==', imageDescription, false);
                            handleImageResponse(imageData);
                        } else {
                            displayMessage(data.text, false);
                        }
                    }
                } else {
                    handleError(data);
                }

                function handleImageResponse(imageData) {
                    if (imageData.status === 'success') {
                        const imageContainer = document.createElement('div');
                        imageContainer.className = 'mx-auto mt-2 relative w-48 h-48 bg-center border-4 rounded-xl border-gray-700 bg-cover';
                        imageContainer.style.backgroundImage = `url(${imageData.imageUrl})`;
                        imageContainer.onclick = (e) => {
                            e.stopPropagation();
                            displayLargeImage(imageData.imageUrl);
                        }

                        const downloadButton = document.createElement('button');
                        downloadButton.innerHTML = '';
                        downloadButton.className = 'absolute bottom-0 right-0 p-2 text-yellow-500 rounded-tl hover:bg-blue-500 hover:text-white';
                        downloadButton.onclick = () => {
                          const a = document.createElement('a');
                          a.href = imageData.imageUrl;
                          a.download = 'generated-image.png';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        };

                        imageContainer.appendChild(downloadButton);
                        chatbox.appendChild(imageContainer);
                    } else {
                        handleError(imageData);
                    }
                }
            } catch (error) {
                handleError(error);
            }
        });

        function showInfoPopup(e) {
          e.preventDefault();
          const tooltip = document.getElementById("infoTooltip");
          if (tooltip.classList.contains("hidden")) {
            tooltip.classList.remove("hidden");
          } else {
            tooltip.classList.add("hidden");
          }
          
        }

    

