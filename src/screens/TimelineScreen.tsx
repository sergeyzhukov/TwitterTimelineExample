import React, {useState} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {
  StyleSheet,
  FlatList,
  Keyboard,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styled from 'styled-components/native';
import {getUserTimeline, clearTimeline} from '../actions';
import {SingleTweet} from '../components';
import {Tweet} from '../reducers/timeline';
import {HeaderHeightContext} from '@react-navigation/stack';
import {TWITTER_PAGINATION_SIZE} from '../constants/twitter';
import {decreaseTwitterIdByOne} from '../utils/twitterId';
import {RootState} from '../reducers';

const AvoidingView = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

interface SelectorState {
  tweets: Tweet[];
  isLoading: boolean;
  error: boolean;
  lastLoadedMaxId?: string;
}

const TimelineScreen = () => {
  const {
    tweets,
    isLoading,
    error,
    lastLoadedMaxId,
  }: SelectorState = useSelector(
    (state: RootState) => ({
      tweets: state.timeline.tweets,
      isLoading: state.timeline.isLoading,
      error: state.timeline.error,
      lastLoadedMaxId: state.timeline.lastLoadedMaxId,
    }),
    shallowEqual,
  );

  const dispatch = useDispatch();
  const [screenName, setScreenName] = useState('');

  const handleSubmit = () => {
    dispatch(clearTimeline());
    Keyboard.dismiss();
    dispatch(getUserTimeline({screenName}));
  };

  const handleEndReached = () => {
    if (
      isLoading ||
      tweets.length === 0 ||
      tweets.length % TWITTER_PAGINATION_SIZE !== 0
    ) {
      return;
    }
    dispatch(
      getUserTimeline({
        screenName,
        maxId: decreaseTwitterIdByOne(lastLoadedMaxId),
      }),
    );
  };

  const renderItem = ({item}: {item: Tweet}) => <SingleTweet item={item} />;

  return (
    <Container>
      <UsernameInputContainer>
        <UsernameInput
          placeholder="Twitter username (ex. elonmusk)"
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={() => handleSubmit()}
          blurOnSubmit={true}
          onChangeText={(text) => {
            dispatch(clearTimeline());
            setScreenName(text);
          }}
        />
        <SearchButton onPress={handleSubmit}>
          <SearchButtonText>Load</SearchButtonText>
        </SearchButton>
      </UsernameInputContainer>
      <HeaderHeightContext.Consumer>
        {(headerHeight) => (
          <StyledAvoidingView
            {...(Platform.OS === 'ios'
              ? {behavior: 'padding', keyboardVerticalOffset: headerHeight}
              : {})}>
            <FlatList
              keyExtractor={(item: Tweet) => `timeline_${item.id}`}
              ItemSeparatorComponent={() => <Separator />}
              onEndReachedThreshold={0.1}
              onEndReached={handleEndReached}
              data={tweets}
              ListFooterComponent={() => {
                if (error) {
                  return <ErrorText>Unable to load data</ErrorText>;
                }
                return isLoading ? (
                  <LoadingIndicator animating color="black" />
                ) : null;
              }}
              renderItem={renderItem}
            />
          </StyledAvoidingView>
        )}
      </HeaderHeightContext.Consumer>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const StyledAvoidingView = styled(AvoidingView)`
  flex: 1;
`;

const LoadingIndicator = styled.ActivityIndicator`
  padding: 24px 0;
`;

const Separator = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  background-color: #c9c9c9;
`;

const UsernameInputContainer = styled.View`
  flex-direction: row;
  padding: 8px 12px;
`;

const UsernameInput = styled.TextInput`
  height: 44px;
  border: ${StyleSheet.hairlineWidth}px solid #bcbcbc;
  flex: 1;
  font-size: 16px;
  padding: 0px 8px;
  border-radius: 16px;
  margin-right: 8px;
`;

const ErrorText = styled.Text`
  font-size: 17px;
  text-align: center;
  padding: 24px 12px;
`;

const SearchButton = styled.TouchableOpacity`
  background-color: #1da1f2;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  border-radius: 12px;
`;

const SearchButtonText = styled.Text`
  color: #fff;
  font-size: 17px;
`;

export default TimelineScreen;
