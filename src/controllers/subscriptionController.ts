import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { User } from '../models/User';
import { Subject } from '../models/Subject';
import { Standard } from '../models/Standard';

export const subscribeUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const { type, referenceId } = req.body;

  if (!['subject', 'standard'].includes(type)) {
    res.status(400);
    throw new Error('Invalid subscription type');
  }

  const item = type === 'subject'
    ? await Subject.findById(referenceId)
    : await Standard.findById(referenceId);

  if (!item) {
    res.status(404);
    throw new Error(`${type} not found`);
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const alreadySubscribed = user.subscriptions.some(
    (sub) => sub.type === type && sub.referenceId?.toString() === referenceId
  );

  if (alreadySubscribed) {
    res.status(400);
    throw new Error('Already subscribed');
  }

  user.subscriptions.push({ type, referenceId });
  await user.save();

  res.status(200).json({ message: `Subscribed to ${type} successfully` });
});
