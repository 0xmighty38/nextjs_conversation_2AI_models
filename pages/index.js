import { useState } from 'react';
import styles from '../styles/ChatPage.module.css';

export default function ChatPage() {
    const [initialPrompt, setInitialPrompt] = useState('');
    const [messages, setMessages] = useState([]);
    const [isConversationActive, setIsConversationActive] = useState(false);

    const startConversation = async() => {
        setIsConversationActive(true);
        let currentMessages = [
            { role: 'user', content: `Let us embark on a discussion regarding: ${initialPrompt}` },
        ];
        setMessages(currentMessages);

        while (
            currentMessages.filter((msg) => msg.role === 'assistant').length < 10
        ) {
            const nextBot =
                currentMessages.filter((msg) => msg.role === 'assistant').length % 2 === 0 ?
                'Bot A' :
                'Bot B';
            currentMessages.push({
                role: 'user',
                content: `Now, ${nextBot}, please continue this refined discourse on the topic.`,
            });

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: currentMessages }),
            });

            if (!response.ok) throw new Error('API call failed');
            const data = await response.json();
            const nextMessage = {
                ...data.message,
                content: nextBot === 'Bot A' ?
                    `Greetings! I am Bot A, delighted to elaborate on this matter. ${data.message.content}` : `Salutations! Bot B here, offering a fresh perspective on our discussion. ${data.message.content}`,
            };
            currentMessages.push(nextMessage);
            setMessages([...currentMessages]);
        }

        setIsConversationActive(false);
        setInitialPrompt('');
    };

    const assistantMessages = messages.filter((msg) => msg.role === 'assistant');
    const botAMessages = assistantMessages.filter((_, index) => index % 2 === 0);
    const botBMessages = assistantMessages.filter((_, index) => index % 2 === 1);

    return ( <
            div className = { styles.container } >
            <
            h1 > Conversational Elegance < /h1> <
            div className = { styles.inputArea } >
            <
            input type = "text"
            value = { initialPrompt }
            onChange = {
                (e) => setInitialPrompt(e.target.value)
            }
            placeholder = "Enter a topic for discourse..."
            disabled = { isConversationActive }
            className = { styles.promptInput }
            /> <
            button onClick = { startConversation }
            disabled = { isConversationActive || initialPrompt.trim() === '' }
            className = { styles.startButton } >
            COMMENCE <
            /button> < /
            div > <
            div className = { styles.conversation } >
            <
            div className = { styles.column } >
            <
            h2 > Bot A🤖 < /h2> {
            botAMessages.map((msg, index) => ( <
                div key = { index }
                className = { `${styles.messageBubble} ${styles.botA}` } >
                <
                span className = { styles.botIcon } > 🤖 < /span> <
                p > { msg.content } < /p> < /
                div >
            ))
        } <
        /div> <
    div className = { styles.column } >
        <
        h2 > Bot B👾 < /h2> {
    botBMessages.map((msg, index) => ( <
        div key = { index }
        className = { `${styles.messageBubble} ${styles.botB}` } >
        <
        span className = { styles.botIcon } > 👾 < /span> <
        p > { msg.content } < /p> < /
        div >
    ))
} <
/div> < /
div > <
    /div>
);
}