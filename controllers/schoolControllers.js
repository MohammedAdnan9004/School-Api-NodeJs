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
    await pool.query(sql, [name, address, latitude, longitude]);

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
      const R = 6371;
      const dLat = ((school.latitude - userLat) * Math.PI) / 180;
      const dLon = ((school.longitude - userLon) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((userLat * Math.PI) / 180) *
          Math.cos((school.latitude * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return { ...school, distance };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
