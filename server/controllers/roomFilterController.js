import Room from "../models/roomModel.js";

export const filterRooms = async (req, res) => {
  try {
    const { minBudget, maxBudget, location, bachelor } = req.query;

    let filter = {};

    if (minBudget || maxBudget) {
      filter.monthlyRent = {};
      if (minBudget) filter.monthlyRent.$gte = Number(minBudget);
      if (maxBudget) filter.monthlyRent.$lte = Number(maxBudget);
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (bachelor !== undefined) {
      filter.isBachelorAllowed = bachelor === "true";
    }

    const rooms = await Room.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Room filtering failed",
      error: error.message
    });
  }
};
