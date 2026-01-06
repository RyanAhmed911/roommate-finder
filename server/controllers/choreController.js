import choreModel from "../models/choreModel.js";
import roomModel from "../models/roomModel.js";

const CHORE_KEYS = [
  "cooking",
  "washingDishes",
  "cleaningRooms",
  "sweeping",
  "dustingFurniture",
  "shopping"
];

const rotation_interval = 24 * 60 * 60 * 1000; 


const shouldRotate = (now, lastRotation) => {
  return now - lastRotation >= rotation_interval;
};


const rotateChores = (users, oldAssignments) => {
  const newAssignments = {};
  const userIds = users.map(u => u._id.toString());

  const lastAssignedIds = CHORE_KEYS.map(
    chore => oldAssignments[chore]?.toString() || userIds[0]
  );

  const rotatedIds = lastAssignedIds.slice(1);
  rotatedIds.push(lastAssignedIds[0]);

  CHORE_KEYS.forEach((chore, index) => {
    const id = rotatedIds[index];
    newAssignments[chore] =
      userIds.includes(id) ? id : userIds[index % userIds.length];
  });

  return newAssignments;
};



export const getChoresForToday = async (req, res) => {
  try {
    const userId = req.userId;

    const room = await roomModel
      .findOne({ users: userId })
      .populate("users", "_id name");

    if (!room) {
      return res.json({ success: false, message: "Room not found" });
    }

    let choreDoc = await choreModel.findOne({ room: room._id });

    if (!choreDoc) {
      const assignments = {};
      const completed = {};

      CHORE_KEYS.forEach((chore, index) => {
        assignments[chore] = room.users[index % room.users.length]._id;
        completed[chore] = false;
      });

      choreDoc = await choreModel.create({
        room: room._id,
        assignments,
        completed,
        lastRotation: new Date()
      });
    }

  
    const now = new Date();

    if (shouldRotate(now, new Date(choreDoc.lastRotation))) {
      choreDoc.assignments = rotateChores(
        room.users,
        choreDoc.assignments
      );

      CHORE_KEYS.forEach(chore => {
        choreDoc.completed[chore] = false;
      });

      choreDoc.lastRotation = now;
      await choreDoc.save();
    }


    let needsSave = false;

    CHORE_KEYS.forEach(chore => {
      const assignedId = choreDoc.assignments[chore]?.toString();
      const exists = room.users.some(
        u => u._id.toString() === assignedId
      );

      if (!exists) {
        choreDoc.assignments[chore] = room.users[0]._id;
        needsSave = true;
      }
    });

    if (needsSave) {
      await choreDoc.save();
    }


    const assignmentsWithUsers = {};

    CHORE_KEYS.forEach(chore => {
      const assignedId = choreDoc.assignments[chore].toString();
      const user = room.users.find(
        u => u._id.toString() === assignedId
      );

      assignmentsWithUsers[chore] = {
        _id: user._id,
        name: user.name
      };
    });

    return res.json({
      success: true,
      chores: {
        assignments: assignmentsWithUsers,
        completed: choreDoc.completed
      }
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const markChoreDone = async (req, res) => {
  try {
    const userId = req.userId;
    const { choreKey } = req.body;

    if (!CHORE_KEYS.includes(choreKey)) {
      return res.json({ success: false, message: "Invalid chore" });
    }

    const room = await roomModel.findOne({ users: userId });
    if (!room) {
      return res.json({ success: false, message: "Room not found" });
    }

    const choreDoc = await choreModel.findOne({ room: room._id });
    if (!choreDoc) {
      return res.json({ success: false, message: "Chores not initialized" });
    }

    if (choreDoc.assignments[choreKey].toString() !== userId) {
      return res.json({ success: false, message: "Not your chore" });
    }

    choreDoc.completed[choreKey] = true;
    await choreDoc.save();

    return res.json({ success: true });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
