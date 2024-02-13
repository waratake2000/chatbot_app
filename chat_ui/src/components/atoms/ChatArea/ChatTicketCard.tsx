import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";

interface StyledDivProps {
    currentHeihgt: any;
    hover: boolean;
};

const TicketExtensionWrapper = styled.div<StyledDivProps>`
    background-color: blue;
    width: 200px;
    display: grid;
    background-color: white;
    transition: grid-template-rows 0.2s ease;
    ${props => !props.hover && css`
        grid-template-rows: 90px;
    `}
    ${props => props.hover && css`
        opacity: 1;
        grid-template-rows: ${props.currentHeihgt}px;
    `}
`;

const TicketWrapper = styled.div`
    overflow-y: hidden;
    padding-bottom: 10px;
    color: #8b9196;

    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.24), 0 5px 7px 0 rgba(0, 0, 0, 0.19);
    transition: all 0.3s ease;
    &: hover {
        box-shadow: 0 12px 15px 0 rgba(0, 0, 0, 0.24), 0 17px 30px 0 rgba(0, 0, 0, 0.19);
        p {
            color: #72777a;
        }
    }
`;

const Subject = styled.h3`
    margin: 0px;
    padding: 10px 15px 0px 15px;
    font-size: 16px;
    color: white;
    font-weight: bold;
    background-color: #63B7E6;
`;

const Zigzag = styled.div`
    height: 15px;
    background: linear-gradient(225deg, #63B7E6 50%, transparent  52%),linear-gradient(135deg, #63B7E6 50%, transparent 52%);
    background-size: 14px 15px;
    margin-bottom: 5px;
`;

const SpText = styled.p`
    color: #72777a;
    margin: 0px 15px;
    padding: 0px;
    font-size: 13px;
    line-height: 20px;
`;

export const ChatTicketCard: React.FC<any> = ({subject, id, summary, metadata}) => {
    const [hover, setHover] = useState<any>(true);

    const [maxHeight, setMaxHeight] = useState<any>();
    const [currentHeihgt, setCurrentHeight] = useState<any>();
    const wrapperRef = useRef<any>(null);
    useEffect(() => {
        setHover(false);
        setMaxHeight(wrapperRef.current.clientHeight);
      }, []);

    useEffect(() => {
        hover ? setCurrentHeight(maxHeight) :  setCurrentHeight(90);
    }, [hover]);

    return (
        <TicketExtensionWrapper
            hover={hover}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            currentHeihgt={currentHeihgt}
        >
            <TicketWrapper ref={wrapperRef}>
                <Subject >{subject}</Subject>
                <Zigzag />
                <SpText>チケット番号: #{id}</SpText>
                <SpText>要約: {summary}</SpText>
                {
                    metadata.map((data, index) => (
                        <SpText>{data.label}: {data.value}</SpText>
                    ))
                }
            </TicketWrapper>
        </TicketExtensionWrapper>
    )
}

