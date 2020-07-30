import {RSAA} from 'redux-api-middleware';
import queryString from 'querystring';
import OAuth from 'oauth-1.0a';
import ActionTypes from '../middleware/actionTypes';
import {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_API_ENDPOINT,
  TWITTER_PAGINATION_SIZE,
} from '../constants/twitter';
import CryptoJS from 'crypto-js';

const oauth = new OAuth({
  consumer: {
    key: TWITTER_CONSUMER_KEY,
    secret: TWITTER_CONSUMER_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(data, key) {
    return CryptoJS.HmacSHA1(data, key).toString(CryptoJS.enc.Base64);
  },
});

export const headers = (params: {
  method: string;
  url: string;
  data: getUserTimeLineAPIParams;
}) => () => {
  try {
    return oauth.toHeader(oauth.authorize(params));
  } catch (error) {
    console.log(error);
  }
};

interface getUserTimeLineAPIParams {
  screen_name: string;
  max_id?: string;
  count: number;
}

export const clearTimeline = () => ({
  type: ActionTypes.TIMELINE_CLEAR,
});

export const getUserTimeline = ({
  screenName,
  maxId,
}: {
  screenName: string;
  maxId?: string;
}) => {
  const data = {
    screen_name: screenName,
    count: TWITTER_PAGINATION_SIZE,
    ...(maxId ? {max_id: maxId} : {}),
  };

  const getParams = queryString.stringify(data);
  const url = `${TWITTER_API_ENDPOINT}/statuses/user_timeline.json`;

  return {
    [RSAA]: {
      headers: headers({
        method: 'GET',
        url,
        data,
      }),
      endpoint: `${url}?${getParams}`,
      method: 'GET',
      types: [
        ActionTypes.API_GET_TIMELINE_LOAD,
        {
          type: ActionTypes.API_GET_TIMELINE_SUCCESS,
          meta: {maxId},
        },
        ActionTypes.API_GET_TIMELINE_FAILURE,
      ],
    },
  };
};
