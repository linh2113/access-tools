require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// 1. Khởi động Server Express
const db = mysql.createConnection({
   // Cấu hình kết nối MySQL sử dụng thông tin từ biến môi trường.
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
});

// 2. Kết nối đến datawarehouse
db.connect((err) => {
   // 3. Kiểm tra kết nối
   if (err) {
      console.error("Error connecting to MySQL database: ", err);
      process.exit(1);
   }
   console.log("Connected to MySQL database");
});

// Các hàm trả về câu lệnh SQL được sử dụng trong API.
const getProducts = () => {
   return "SELECT * FROM product_dim"; // Truy vấn tất cả sản phẩm từ bảng `product_dim`.
};

const getProductCount = () => {
   return "SELECT COUNT(*) AS total_count FROM product_dim"; // Truy vấn số lượng sản phẩm.
};

const getAveragePrice = () => {
   return "SELECT AVG(price) AS average_price FROM product_dim"; // Tính giá trung bình của sản phẩm.
};

const getPriceRange = () => {
   return "SELECT MAX(price) AS max_price, MIN(price) AS min_price FROM product_dim"; // Lấy khoảng giá lớn nhất và nhỏ nhất.
};

const getManufacturerStats = () => {
   return "SELECT manufacturer, COUNT(*) AS product_count FROM product_dim GROUP BY manufacturer"; // Đếm số lượng sản phẩm theo nhà sản xuất.
};
// Tính trọng lượng trung bình, lớn nhất và nhỏ nhất.
const getWeightStats = () => {
   return `
        SELECT 
            AVG(CAST(weight AS DECIMAL)) AS average_weight, 
            MAX(CAST(weight AS DECIMAL)) AS max_weight, 
            MIN(CAST(weight AS DECIMAL)) AS min_weight 
        FROM product_dim
        WHERE weight IS NOT NULL AND weight != '';
    `;
};

const getResolutionStats = () => {
   return "SELECT resolution, COUNT(*) AS count FROM product_dim GROUP BY resolution"; // Đếm số lượng sản phẩm theo độ phân giải.
};

// Định nghĩa các route API:
// Trả về danh sách sản phẩm.
app.get("/api/products", (req, res) => {
   db.query(getProducts(), (err, results) => {
      if (err) {
         return res.status(500).json({ error: err.message }); // Xử lý lỗi nếu có.
      }
      res.json(results); // Trả về kết quả dưới dạng JSON.
   });
});

// Trả về tổng số sản phẩm.
app.get("/api/products/count", (req, res) => {
   db.query(getProductCount(), (err, results) => {
      if (err) {
         return res.status(500).json({ error: err.message }); // Xử lý lỗi nếu có.
      }
      res.json({ total_count: results[0].total_count }); // Trả về số lượng sản phẩm.
   });
});

// Trả về giá trung bình của sản phẩm.
app.get("/api/products/average-price", (req, res) => {
   db.query(getAveragePrice(), (err, results) => {
      if (err) {
         return res.status(500).json({ error: err.message }); // Xử lý lỗi nếu có.
      }
      res.json({ average_price: results[0].average_price }); // Trả về giá trung bình.
   });
});

// Trả về khoảng giá (lớn nhất và nhỏ nhất).
app.get("/api/products/price-range", (req, res) => {
   db.query(getPriceRange(), (err, results) => {
      if (err) {
         return res.status(500).json({ error: err.message }); // Xử lý lỗi nếu có.
      }
      res.json({
         max_price: results[0].max_price, // Giá lớn nhất.
         min_price: results[0].min_price, // Giá nhỏ nhất.
      });
   });
});

// Trả về thống kê theo nhà sản xuất.
app.get("/api/products/manufacturer-stats", (req, res) => {
   db.query(getManufacturerStats(), (err, results) => {
      if (err) {
         return res.status(500).json({ error: err.message }); // Xử lý lỗi nếu có.
      }
      res.json(results); // Trả về kết quả thống kê.
   });
});

// Trả về thống kê trọng lượng.
app.get("/api/products/weight-stats", (req, res) => {
   db.query(getWeightStats(), (err, results) => {
      if (err) {
         return res.status(500).json({ error: err.message }); // Xử lý lỗi nếu có.
      }
      res.json({
         average_weight: results[0].average_weight, // Trọng lượng trung bình.
         max_weight: results[0].max_weight, // Trọng lượng lớn nhất.
         min_weight: results[0].min_weight, // Trọng lượng nhỏ nhất.
      });
   });
});

// Trả về thống kê độ phân giải.
app.get("/api/products/resolution-stats", (req, res) => {
   db.query(getResolutionStats(), (err, results) => {
      if (err) {
         return res.status(500).json({ error: err.message }); // Xử lý lỗi nếu có.
      }
      res.json(results); // Trả về kết quả thống kê.
   });
});

// Khởi chạy server.
app.listen(port, () => {
   console.log(`Server running on http://localhost:${port}`); // Thông báo server đang chạy.
});
