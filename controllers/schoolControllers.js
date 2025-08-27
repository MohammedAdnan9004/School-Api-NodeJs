const pool = require("../config/db");

exports.addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (isNaN(latitude) || isNaN(longitude)) {
      return res
        .status(400)
        .json({ message: "Latitude and Longitude must be numbers" });
    }

    const sql =
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
    await pool.execute(sql, [name, address, latitude, longitude]);

    res.status(201).json({ message: "School added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      return res
        .status(400)
        .json({ message: "Valid latitude and longitude are required" });
    }

    const [schools] = await pool.query("SELECT * FROM schools");

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const schoolsWithDistance = schools.map((school) => {
      const distance = Math.sqrt(
        Math.pow(userLat - school.latitude, 2) +
          Math.pow(userLon - school.longitude, 2)
      );
      return { ...school, distance };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
