export class Message<ValueType> {
  topic: string = '';

  value: ValueType | undefined;

  success: boolean = false;

  constructor(messageStr?: string) {
    if (messageStr) {
      const parsed = this.parseMessage(messageStr);

      this.topic = parsed?.topic;
      this.value = parsed?.value;
      this.success = parsed?.success;
    }
  }

  parseMessage(data: string): Message<ValueType> {
    try {
      return JSON.parse(data) as Message<ValueType>;
    } catch (err: any) {
      const errorMessage = new Message<ValueType>();
      errorMessage.success = false;
      errorMessage.topic = '';
      errorMessage.value = err?.message;
      return errorMessage;
    }
  }
}
