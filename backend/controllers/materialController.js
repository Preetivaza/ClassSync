import Material from "../models/Material.js";

// Upload material
export const uploadMaterial = async (req, res) => {
  try {
    const { title, description, groupId } = req.body;
    const fileUrl = req.file.path; // Assuming Multer middleware handles file uploads

    const material = new Material({
      title,
      description,
      fileUrl,
      groupId,
      uploadedBy: req.user._id,
    });

    await material.save();
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ error: "Failed to upload material" });
  }
};

// Get all materials for a group
export const getMaterials = async (req, res) => {
  try {
    const { groupId } = req.params;
    const materials = await Material.find({ groupId }).populate(
      "uploadedBy",
      "username email"
    );
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch materials" });
  }
};

// Delete a material
export const deleteMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    await Material.findByIdAndDelete(materialId);
    res.status(200).json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete material" });
  }
};
