import React, {memo} from 'react';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import isEqual from 'lodash/isEqual';
import {Tweet} from '../reducers/timeline';

interface ISingleTweetProps {
  item: Tweet;
}

const Component: React.FC<ISingleTweetProps> = ({item}: ISingleTweetProps) => {
  const {screenName, name, text, profileImageURL, humanDate} = item;

  return (
    <Container>
      <Avatar source={{uri: profileImageURL}} />
      <ContentContainer>
        <Text>
          <Name>{name}</Name>
          <ScreenName numberOfLines={1}>{` @${screenName}`}</ScreenName>
          <Date> - {humanDate}</Date>
        </Text>
        <ContentText>{text}</ContentText>
      </ContentContainer>
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  padding: 12px 16px;
`;

const Avatar = styled(FastImage)`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-right: 12px;
  overflow: hidden;
`;

const ContentContainer = styled.View`
  flex: 1;
`;

const Text = styled.View`
  flex-direction: row;
`;

const ContentText = styled.Text`
  margin-top: 4px;
  font-size: 15px;
`;

const ScreenName = styled.Text`
  color: #797979;
  flex-wrap: nowrap;
  flex-shrink: 1;
`;

const Name = styled.Text`
  font-weight: bold;
`;

const Date = styled.Text`
  color: #797979;
`;

export const SingleTweet = memo(Component, isEqual);
