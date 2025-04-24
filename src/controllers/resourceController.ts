import { Request, Response } from "express";
import { Resource } from "../models/Resource";
import { Subject } from "../models/Subject";
import { User } from "../models/User";

// Create resource(s)
export const createResource = async (req: Request, res: Response) => {
  try {
    const { resources, subjectId } = req.body; // resources: array

    if (!Array.isArray(resources) || resources.length === 0 || resources.length > 10) {
      return res.status(400).json({ message: "You must provide between 1 and 10 resources" });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const createdResources = await Promise.all(
      resources.map(async (resItem) => {
        const newResource = new Resource({
          title: resItem.title,
          type: resItem.type,
          url: resItem.url,
          isFree: resItem.isFree || false,
          subject: subject._id,
        });
        return await newResource.save();
      })
    );

    res.status(201).json(createdResources);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
};

// Get resources by subject
export const getResourcesBySubject = async (req: Request, res: Response) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const subject = await Subject.findById(subjectId).populate("standard");
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const isSubjectSubscribed = user.subscriptions.some(
      (sub) => sub.type === "subject" && sub.referenceId?.toString() === subjectId
    );

    const isStandardSubscribed = user.subscriptions.some(
      (sub) =>
        sub.type === "standard" &&
        sub.referenceId?.toString() === subject.standard._id.toString()
    );

    const resources = await Resource.find({ subject: subjectId }).populate("subject");

    const result = resources.map((resource) => ({
      ...resource.toObject(),
      isAccess: isSubjectSubscribed || isStandardSubscribed || resource.isFree,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
};

// Update a resource
export const updateResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, type, url, isFree } = req.body;

    const updated = await Resource.findByIdAndUpdate(
      id,
      { title, type, url, isFree },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
};

// Delete a resource
export const deleteResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await Resource.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({ message: "Resource deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
};

// Get all resources
export const getAllResources = async (req: Request, res: Response) => {
  try {
    const resources = await Resource.find().populate("subject");
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
};
