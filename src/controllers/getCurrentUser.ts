// export const getCurrentUser = async (req: any, res: Response) => {
//     if (!req.user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
  
//     res.json({
//       _id: req.user._id,
//       name: req.user.name,
//       email: req.user.email,
//       subscription: req.user.subscription, // or whatever field you use
//     });
//   };
  