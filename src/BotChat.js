import React, {useEffect, useState} from 'react';
import MessageArea from './MessageArea';
import LoadingAnimation from './LoadingAnimation';
import axios from 'axios';
import './styles.css';
import Sidebar from "./Sidebar"; // импортируем стили
import { getServerAddress } from './serverConfig';
function BotChat() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState(''); // Добавляем состояние для ID разговора
    const [username, setUsername] = useState(''); // состояние для имени пользователя


    const sendMessage = async () => {
        setIsLoading(true);
        try {
            const userMessage = { role: 'user-message', content: message };
            const newMessages = [...messages, userMessage];
            setMessages(newMessages);
            const address = getServerAddress(); // Получаем текущий адрес сервера
            const response = await axios.post(`${address}/chat`, {
                message: {
                    role: "user",
                    content: message
                },
                conversation_id: conversationId, // Используем conversationId из состояния
                over: false
            });

            // Обновляем ID разговора, если он есть в ответе
            if (response.data.conversation_id && !conversationId) {
                setConversationId(response.data.conversation_id);
            }


            const assistantMessage = {
                role: 'assistant-message',
                content: response.data.content,
                pairId: response.data.pair_id // Сохраняем pairId, предоставленный сервером
            };
            console.log(assistantMessage)
            setMessages([...newMessages, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
            setMessage(''); // Очищаем поле ввода после отправки сообщения
        }

    };

    useEffect(() => {
        if (conversationId) {
            loadMessagesForConversation(conversationId);
        }
    }, [conversationId]); // Загрузка сообщений при изменении conversationId

    const loadMessagesForConversation = async (conversationId) => {
        setIsLoading(true);
        try {
            const address = getServerAddress(); // Получаем текущий адрес сервера
            const response = await axios.get(`${address}/messages/${conversationId}`);
            const formattedMessages = response.data.map(msg => {
                // Общий формат для всех сообщений
                const formattedMessage = {
                    role: msg.role + '-message', // добавляем '-message' к роли для соответствия классам
                    content: msg.content,
                };

                // Если это сообщение ассистента и содержит pair_id, добавляем его
                if (msg.role === "assistant" && msg.pair_id) {
                    formattedMessage.pairId = msg.pair_id;
                }

                return formattedMessage;
            });

            setMessages(formattedMessages);
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setIsLoading(false);
        }
    };


    return (

        <div className="bot-chat">
            <div className="username-input">
                <input

                    type="text"
                    placeholder="Введите ваше имя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <Sidebar onConversationSelected={setConversationId}/>

            <div className="chat-area">
                <MessageArea messages={messages} isLoading={isLoading} username={username} />


                <div id="bottomPanel">
                    <div id="bottomPanelinput">
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Введите сообщение..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !isLoading) {
                                    sendMessage();
                                }
                            }}
                        />
                        <button className="send-button" onClick={sendMessage} disabled={isLoading}>Отправить</button>
                    </div>
                </div>
                {isLoading && <LoadingAnimation/>}
            </div>
        </div>
    );


}

export default BotChat;
