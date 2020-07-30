import moment from 'moment';
import ActionTypes from '../middleware/actionTypes';
import {TWITTER_MOMENT_FORMAT} from '../constants/twitter';

export interface TimelineState {
  isLoading: boolean;
  tweets: Tweet[];
  lastLoadedMaxId?: string;
  error: boolean;
}

const initialState: TimelineState = {
  isLoading: false,
  tweets: [],
  lastLoadedMaxId: undefined,
  error: false,
};

export const TwitterField = Object.freeze({
  id: 'id_str',
  userId: 'user_id',
  text: 'text',
  createdAt: 'created_at',
  screenName: 'screen_name',
  profileImageURL: 'profile_image_url',
});

export interface Tweet {
  id: string;
  userId: string;
  name: string;
  text: string;
  createdAt: string;
  humanDate: string;
  screenName: string;
  profileImageURL: string;
}

export const timeline = (state = initialState, action): TimelineState => {
  switch (action.type) {
    case ActionTypes.TIMELINE_CLEAR:
      return {...state, tweets: [], error: false};
    case ActionTypes.API_GET_TIMELINE_SUCCESS:
      const tweets: Tweet[] = action.payload.map((tweet) => ({
        id: tweet[TwitterField.id],
        text: tweet[TwitterField.text],
        name: tweet.user?.name,
        profileImageURL: tweet.user?.[TwitterField.profileImageURL],
        screenName: tweet.user?.[TwitterField.screenName],
        createdAt: tweet[TwitterField.createdAt],
        humanDate: moment(
          tweet[TwitterField.createdAt],
          TWITTER_MOMENT_FORMAT,
        ).format('ll'),
      }));

      if (tweets.length === 0) {
        return {
          ...state,
          isLoading: false,
          error: false,
          tweets: action.meta.maxId ? [...state.tweets, ...tweets] : tweets,
        };
      }
      const lastTweetId = tweets[tweets.length - 1].id;
      return {
        isLoading: false,
        tweets: action.meta.maxId ? [...state.tweets, ...tweets] : tweets,
        error: false,
        lastLoadedMaxId: lastTweetId,
      };
    case ActionTypes.API_GET_TIMELINE_LOAD:
      return {...state, isLoading: true, error: false};
    case ActionTypes.API_GET_TIMELINE_FAILURE:
      return {...state, isLoading: false, error: true};
    default:
      return state;
  }
};
