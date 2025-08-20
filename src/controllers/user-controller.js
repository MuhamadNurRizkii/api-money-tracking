import {
  createTransactionQuery,
  deleteTransactionByIdQuery,
  getDataProfileQuery,
  getDataTransactionQuery,
  getDetailTransactionQuery,
  getTransactionsByIdQuery,
  getTransactionsByMonthQuery,
  getTransactionsByWeekQuery,
  updateTransactionsByIdQuery,
} from "../models/user-query.js";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../validations/user-validation.js";

export const getDataTransaction = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await getDataTransactionQuery(userId);

    res.json({ data: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Terjadi kesalahan server", error });
  }
};

export const getDetailTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    console.log(userId);
    console.log(page);
    console.log(limit);

    const data = await getDetailTransactionQuery(userId, page, limit);

    res.json({ data: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Terjadi kesalahan server", error });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { error, value } = createTransactionSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((detail) => detail.message) });
    }

    const { title, amount, type } = value;

    await createTransactionQuery(userId, title, amount, type);

    res.json({ message: "Transaksi berhasil ditambahkan" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Terjadi kesalahan server", details: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const data = await getTransactionsByIdQuery(id, userId);

    res.json({ data: data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Terjadi kesalahan server", message: error.message });
  }
};

export const updateTransactionsById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { error, value } = updateTransactionSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      if (error) {
        return res
          .status(400)
          .json({ error: error.details.map((detail) => detail.message) });
      }
    }

    // Jika tidak ada data yang dikirim
    if (Object.keys(value).length === 0) {
      return res.status(400).json({
        error: "Tidak ada data yang dikirim untuk diperbarui",
      });
    }

    const updated = await updateTransactionsByIdQuery(id, userId, value);

    if (!updated) {
      return res.status(404).json({ error: "Transaksi tidak ditemukan" });
    }

    return res.status(200).json({
      message: "Transaksi berhasil diperbarui",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Terjadi kesalahan server", message: error.message });
  }
};

export const deleteTransactionController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "Invalid transaction ID" });
    }

    const result = await deleteTransactionByIdQuery(id, userId);

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Transaction not found" });
    }

    return res.status(200).json({ message: "Transaction berhasil dihapus" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Terjadi kesalahan server", message: error.message });
  }
};

export const getDataProfileController = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await getDataProfileQuery(userId);

    return res.json({ data: data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Terjadi kesalahan server", message: error.message });
  }
};

export const getDataTransactionsDateController = async (req, res) => {
  try {
    const { type } = req.params;
    const userId = req.user.id;

    if (type === "mingguan") {
      const result = await getTransactionsByWeekQuery(userId);

      return res.status(200).json({
        message: "success",
        data: result,
      });
    } else if (type === "bulanan") {
      const result = await getTransactionsByMonthQuery(userId);

      return res.status(200).json({
        message: "success",
        data: result,
      });
    } else {
      return res.status(400).json({
        error: "fail",
        message: 'type tidak valid, gunakan "mingguan" atau "bulanan"',
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Terjadi kesalahan server", message: error.message });
  }
};
