import React, {useState} from 'react';
import LoadingAnimation from "./LoadingAnimation";
import axios from 'axios'; // Убедитесь, что axios установлен в вашем проекте
import { getServerAddress } from './serverConfig';
function MessageArea({ messages, isLoading, username}) {
    const [showRatingMessage, setShowRatingMessage] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageStyle, setMessageStyle] = useState({});
    const timeOutMessageLog = 4000;
    // Функция для отправки оценки на сервер
    const sendRating = async (pairId, tag, username) => {
        console.log(`Sending rating for pairId: ${pairId}, rating: ${tag}`); // Для отладки
        if (!username) { // Предполагается, что username - это состояние с именем пользователя
            displayMessage("Имя пользователя не задано", { backgroundColor: "#dc3545", color: "#fff" });
            return;
        }
        try {
            const address = getServerAddress(); // Получаем текущий адрес сервера
            const response = await axios.post(`${address}/rate`, {
                id_pair: pairId,
                rating: tag,
                username: "#"+username,
            });
            if (response.data.status === "ok") {
                // Показываем уведомление
                setShowRatingMessage(true);
                // Скрываем уведомление через 10 секунд
                setTimeout(() => {
                    setShowRatingMessage(false);
                }, timeOutMessageLog);
            }
            console.log('Рейтинг успешно отправлен');
        } catch (error) {
            console.error('Ошибка при отправке рейтинга', error);
        }

    };
    const displayMessage = (text, style) => {
        setMessageText(text);
        setMessageStyle(style);
        setShowMessage(true);

        setTimeout(() => {
            setShowMessage(false);
        }, timeOutMessageLog);
    };
    function formatMessage(text) {
        const tripleBackticksRegex = /(```[^`]*```)/g;
        const singleBacktickRegex = /(`[^`]*`)/g;
        let keyIndex = 0;
        const processText = (text, isTriple) => {
            return text.split(isTriple ? tripleBackticksRegex : singleBacktickRegex).map((part) => {
                if (isTriple && part.startsWith("```") && part.endsWith("```")) {

                    return <span key={keyIndex++} style={{ color: 'Teal', fontWeight: 'bold'  }}>{part.slice(3, -3)}</span>;

                } else if (!isTriple && part.startsWith("`") && part.endsWith("`")) {
                    return <strong key={keyIndex++}>{part.slice(1, -1)}</strong>;
                }
                return part;
            });
        };
        const formattedText = processText(text, true).flatMap((part) =>
            typeof part === 'string' ? processText(part, false) : part
        );
        return (
            <div key="formattedText" style={{ whiteSpace: 'pre-wrap' }}>
                {formattedText}
            </div>
        );
    }

    return (
        <div className="message-area">
            {messages.map((msg, index) => (
                <div key={index} className={msg.role}>
                    {formatMessage(msg.content)}
                    {msg.role === 'assistant-message' &&

                        <Greeting role={msg.role} pairId={msg.pairId} onRate={sendRating} username={username} />}

                </div>
            ))}

            {showMessage && (
                <div className="message" style={messageStyle}>
                    {messageText}
                </div>
            )}
            {isLoading && <LoadingAnimation className="loading-animation"/>}
            {showRatingMessage && (
                <div className="rating-message">
                    Оценка выставлена успешно
                </div>

            )}
        </div>
    );
}

function Greeting({ role, pairId, onRate, username }) {
    const [isOpen, setIsOpen] = useState(false); // Состояние для открытия всплывающего окна

    // Список тегов с смайликами
    const tagsWithEmojis = [
        { tag: "#внимание", emoji: "👀" },
        { tag: "#восприятие", emoji: "🧠" },
        { tag: "#любопытство", emoji: "🔍" },
        { tag: "#удивление", emoji: "😲" },
        { tag: "#заинтересованность", emoji: "🤔" },
        { tag: "#готовность", emoji: "🏁" },
        { tag: "#оптимизм", emoji: "😊" },
        { tag: "#радость", emoji: "😃" },
        { tag: "#эйфория", emoji: "🥳" },
        { tag: "#сомнение", emoji: "🤨" },
        { tag: "#озадаченность", emoji: "😕" },
        { tag: "#возбуждение", emoji: "💥" },
        { tag: "#тревога", emoji: "😰" },
        { tag: "#негодование", emoji: "😡" },
        { tag: "#страх", emoji: "😨" },
        { tag: "#ужас", emoji: "😱" },
        { tag: "#злость", emoji: "😠" },
        { tag: "#стресс", emoji: "😫" },
        { tag: "#аффектация", emoji: "🤥" },
        { tag: "#скука", emoji: "😒" },
        { tag: "#утомление", emoji: "😴" },
        { tag: "#апатия", emoji: "😔" },
        { tag: "#угнетенность", emoji: "😞" },
    ];

    const handleTagClick = (tag) => {
        setIsOpen(false); // Закрываем всплывающее окно
        onRate(pairId, tag, username); // Отправляем хештег и имя пользователя
    };

    return (
        <div className="greeting-container">
            <button className="mark-button" onClick={() => setIsOpen(!isOpen)}>Оценить</button>
            {isOpen && (
                <div className="tags-popup">
                    {tagsWithEmojis.map(({ tag, emoji }, index) => (
                        <button key={index} className="tag-button" onClick={() => handleTagClick(tag)}>
                            {emoji} {tag}
                        </button>
                    ))}
                </div>
            )}

        </div>
    );
}


export default MessageArea;
