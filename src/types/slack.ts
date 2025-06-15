export interface SlackEvent {
  type: string;
  event?: {
    type: string;
    user: string;
    text: string;
    channel: string;
    ts: string;
    thread_ts?: string;
    bot_id?: string;
  };
  team_id: string;
  api_app_id: string;
  event_id: string;
  event_time: number;
}

export interface SlackChallenge {
  type: "url_verification";
  challenge: string;
  token: string;
}

export interface SlackEventRequest {
  body: SlackEvent | SlackChallenge;
  headers: Headers;
}

export interface SlackMessage {
  channel: string;
  text: string;
  thread_ts?: string;
}