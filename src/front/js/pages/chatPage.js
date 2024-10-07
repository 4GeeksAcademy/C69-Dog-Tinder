import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import  useStore from '../store/appContext'; 

const ChatPage = () => {
    const { id: userId } = useParams(); 
    const { store, actions } = useStore(); 
    const [matches, setMatches] = useState(store.matches);
    const [messages, setMessages] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    
    useEffect(() => {
        if (userId) {
            actions.fetchMatches(userId);
        }
    }, [userId, actions]);

    const handleMatchClick = (matchId) => {
        setSelectedMatch(matchId);
        actions.fetchMessages(userId, matchId).then(data => setMessages(data));
    };

    const sendMessage = () => {
        if (messageInput.trim()) {
            actions.sendMessages(userId, selectedMatch, { value: messageInput });
            setMessageInput(''); 
        }
    };

    return (
        <div className="chat-page">
            <h2>Your Matches</h2>
            <ul className="matches-list">
                {matches.map(match => (
                    <li key={match.id} onClick={() => handleMatchClick(match.id)}>
                        {match.username}
                    </li>
                ))}
            </ul>

            {selectedMatch && (
                <div className="chat-area">
                    <h3>Chat with {selectedMatch}</h3>
                    <div className="messages" id="messagesArea">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.from === userId ? 'from' : 'to'}`}>
                                <span>{msg.content}</span>
                                <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            )}
        </div>
    );
};

export default ChatPage;
