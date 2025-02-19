import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { actionDelMessage, actionMessage } from "../store/messages/actions";
import { selectMessages } from "../store/messages/selectors";

import { ListChannels } from "./Channels/ListChannels";
import { FieldMessages } from "./FieldMessage/FieldMessages";
import { channelSelect } from "../store/channels/actions";
import { connectEcho } from "../utils/connectEcho";
import Echo from "laravel-echo";

export const ChatContainer = () => {
    const { channel_id } = useParams();
    const messages = useSelector(selectMessages);
    const dispatch = useDispatch();
    const [selChannel, setSelChannel] = useState(null);

    useEffect(() => {
        const echoInit = new Echo(connectEcho);
        const chat = echoInit
            .join("chat-corp." + channel_id)
            .here((users) => {
                console.log(users);
            })
            .joining((user) => {
                console.log(user);
            })
            .listen("MessageSent", (content) => {
                dispatch(actionMessage(channel_id, content));
                console.log(content);
            });
        console.log("chat: ", chat);
        console.log("Проверка работы Echo");
    });

    useEffect(() => {
        setSelChannel(channel_id);

        dispatch(channelSelect(channel_id));
    }, [setSelChannel]);
    console.log(selChannel);
    const sendNewMessage = useCallback(
        (newMessage) => {
            console.log(newMessage);
            // dispatch(sendMessageChannel(channelId, ...newMessage));
            dispatch(actionMessage(channel_id, newMessage));
        },
        [channel_id, messages]
    );
    const deleteMessages = useCallback(
        (selMessage) => {
            dispatch(actionDelMessage(channel_id, { ...selMessage }));
        },
        [messages]
    );

    return (
        <>
            <ListChannels />
            <FieldMessages
                messages={messages}
                onSendMessage={sendNewMessage}
                onDelMessage={deleteMessages}
            />
        </>
    );
};
