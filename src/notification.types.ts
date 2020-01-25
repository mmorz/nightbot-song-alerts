export interface Store {
  readonly username: string;
  readonly channels: ReadonlyArray<string>;
  readonly enabled: boolean;
  readonly oldNotifications: ReadonlyArray<string>;
}
