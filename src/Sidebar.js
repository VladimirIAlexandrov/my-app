import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import ConnectionSettingsModal from "./ConnectionSettingsModal";
import axios from 'axios';
import { getServerAddress } from './serverConfig';
function Sidebar({ onConversationSelected }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [conversations, setConversations] = useState([]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const address = getServerAddress(); // Получаем текущий адрес сервера
                const response = await axios.get(`${address}/conversations`);
                setConversations(response.data);
            } catch (error) {
                console.error('Ошибка при получении списка чатов:', error);
            }
        };

        fetchConversations();
    }, []);

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <button className="toggle-button" onClick={toggleSidebar}>
                {isOpen ? '<' : '>'}
            </button>
            {isOpen && <div className="sidebar-content">
                <h3>История чатов</h3>
                <ul>
                    {conversations.map(conversation => (
                        <li key={conversation.conversation_id} onClick={() => onConversationSelected(conversation.conversation_id)}>
                            {conversation.first_message || "Чат без сообщений"}
                        </li>
                    ))}
                </ul>
            </div>}
            <div className="sidebar-settings">
                <button className="settings-button" onClick={() => setIsModalOpen(true)}>
                    <span>Параметры</span>
                </button>
            </div>
            <ConnectionSettingsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

export default Sidebar;
