import { ic } from 'azle';
import { Response, Request } from 'express';
import { Message } from 'Database/entities/message';
import MessagePostValidator from 'App/Validators/MessagePostValidator';

import MessageUpdateValidator from 'App/Validators/MessageUpdateValidator';
import { User } from 'Database/entities/user';

export default class MessageController {
  static async postmessage(request: Request, response: Response) {
    const { data, success, error } = MessagePostValidator.validate(request.body);

    if (!success) {
      response.status(400);
      const { path, message } = error.issues?.[0];

      return response.json({
        status: 0,
        message: `${path?.join('.')}: ${message}`,
      });
    }

    const { message } = data;

    const messageData: Partial<Message> = {
      message,
    };

    await Message.save(messageData);
  }

  static async updatemessage(request: Request, response: Response) {
    try {
      const { messageId } = request.params;
      const { data, success, error } = MessageUpdateValidator.validate(request.body);

      if (!success) {
        response.status(400);
        const { path, message } = error.issues?.[0];

        return response.json({
          status: 0,
          message: `${path?.join('.')}: ${message}`,
        });
      }

      const findUser = await User.findOneBy({
        principal_id: ic.caller().toText(),
      });

      if (!findUser) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'User not found.',
        });
      }

      const { message } = data;

      const findMessage = await Message.findOneBy({
        id: messageId as unknown as number,
        user: findUser,
      });

      if (!findMessage) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'Event not found.',
        });
      }

      if (message) {
        findMessage.message = message;
      }

      await findMessage.save();

      return response.json({
        status: 1,
        message: 'Event updated successfully!',
      });
    } catch (error: any) {
      response.status(400);
      return response.json({
        status: 0,
        message: error.message,
      });
    }
  }
}
