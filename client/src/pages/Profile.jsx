import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function Profile() {
  const stored = JSON.parse(localStorage.getItem("kisan_user") || "null");

  const [loading, setLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);
  const [error, setError] = useState(null);

  const [image, setImage] = useState(null);

  // ✅ FIX: no localhost
  const [preview, setPreview] = useState(
    stored?.profilePic || null
  );

  const [form, setForm] = useState({
    name: stored?.name || "",
    email: stored?.email || "",
    phone: stored?.phone || "",
    address: {
      street: stored?.address?.street || "",
      city: stored?.address?.city || "",
      state: stored?.address?.state || "",
      zipcode: stored?.address?.zipcode || "",
    },
  });

  // ==========================
  // 🔹 LOAD USER DATA
  // ==========================
  useEffect(() => {
    API.get("/auth/me")
      .then(res => {
        const u = res.data.user;

        setForm({
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          address: {
            street: u.address?.street || "",
            city: u.address?.city || "",
            state: u.address?.state || "",
            zipcode: u.address?.zipcode || "",
          },
        });

        // ✅ FIX: use direct URL
        if (u.profilePic) {
          setPreview(u.profilePic);
        }
      })
      .catch(() => {});
  }, []);

  function handleChange(path, value) {
    if (path.startsWith("address.")) {
      const k = path.split(".")[1];
      setForm(f => ({ ...f, address: { ...f.address, [k]: value } }));
    } else {
      setForm(f => ({ ...f, [path]: value }));
    }
  }

  // ==========================
  // 🔥 IMAGE UPLOAD
  // ==========================
  async function handleImageUpload() {
    if (!image) return alert("Select image first");

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await API.post("/auth/upload-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ FIX: update latest user
      const currentUser = JSON.parse(localStorage.getItem("kisan_user"));

      const updatedUser = {
        ...currentUser,
        profilePic: res.data.profilePic,
      };

      localStorage.setItem("kisan_user", JSON.stringify(updatedUser));

      // ✅ FIX: no localhost
      setPreview(res.data.profilePic);

      alert("Profile photo updated ✅");

      // 🔥 optional: reload navbar instantly
      window.location.reload();

    } catch (err) {
      alert("Upload failed ❌");
    }
  }

  // ==========================
  // 🔹 SAVE PROFILE
  // ==========================
  async function saveProfile(e) {
    e.preventDefault();
    setSaveMsg(null);
    setError(null);
    setLoading(true);

    try {
      const res = await API.put("/auth/me", {
        name: form.name,
        phone: form.phone,
        address: form.address,
      });

      if (res.data?.user) {
        localStorage.setItem("kisan_user", JSON.stringify(res.data.user));
      }

      setSaveMsg("Profile updated successfully");

    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 700 }}>
      
      <h2 className="mb-3">My Profile</h2>

      {/* 🔥 PROFILE IMAGE */}
      <div className="text-center mb-4">
        {preview ? (
          <img
            src={preview}
            alt="profile"
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover"
            }}
          />
        ) : (
          <div className="avatar-circle">
            {form.name?.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="mt-2">
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              setImage(file);
              setPreview(URL.createObjectURL(file)); // preview before upload
            }}
          />

          <button
            className="btn btn-sm btn-success mt-2"
            onClick={handleImageUpload}
          >
            Upload Photo
          </button>
        </div>
      </div>

      {saveMsg && <div className="alert alert-success">{saveMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={saveProfile}>

        <input
          className="form-control mb-3"
          value={form.name}
          onChange={e => handleChange("name", e.target.value)}
        />

        <input
          className="form-control mb-3"
          value={form.email}
          readOnly
        />

        <input
          className="form-control mb-3"
          value={form.phone}
          onChange={e => handleChange("phone", e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Street"
          value={form.address.street}
          onChange={e => handleChange("address.street", e.target.value)}
        />

        <div className="row">
          <div className="col">
            <input
              className="form-control mb-2"
              placeholder="City"
              value={form.address.city}
              onChange={e => handleChange("address.city", e.target.value)}
            />
          </div>

          <div className="col">
            <input
              className="form-control mb-2"
              placeholder="State"
              value={form.address.state}
              onChange={e => handleChange("address.state", e.target.value)}
            />
          </div>
        </div>

        <input
          className="form-control mb-3"
          placeholder="Zipcode"
          value={form.address.zipcode}
          onChange={e => handleChange("address.zipcode", e.target.value)}
        />

        <button className="btn btn-success">
          {loading ? "Saving..." : "Save Changes"}
        </button>

      </form>
    </div>
  );
}