const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = {};

// Fungsi membuat folder
app.makeFolder = () => {
  rl.question("Masukan Nama Folder : ", (folderName) => {
    fs.mkdir(path.join(__dirname, folderName), { recursive: true }, (err) => {
      if (err) throw err;
      console.log("Folder berhasil dibuat");
      rl.close();
    });
  });
};

// Fungsi membuat file
app.makeFile = () => {
  rl.question("Masukan Nama File (dengan ekstensi) : ", (fileName) => {
    fs.writeFile(path.join(__dirname, fileName), "", (err) => {
      if (err) throw err;
      console.log("File berhasil dibuat");
      rl.close();
    });
  });
};

// Fungsi merapikan folder berdasarkan ekstensi
app.extSorter = () => {
  const unorganizeFolder = path.join(__dirname, "unorganize_folder");

  fs.readdir(unorganizeFolder, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const ext = path.extname(file).slice(1); // ambil ekstensi file tanpa dot
      const targetFolder = path.join(__dirname, ext);

      fs.mkdir(targetFolder, { recursive: true }, (err) => {
        if (err) throw err;

        fs.rename(
          path.join(unorganizeFolder, file),
          path.join(targetFolder, file),
          (err) => {
            if (err) throw err;
            console.log(`File ${file} dipindahkan ke folder ${ext}`);
            process.exit(); // Menutup program setelah proses selesai
          }
        );
      });
    });
  });
};

// Fungsi membaca isi folder
app.readFolder = () => {
  rl.question("Masukan Nama Folder yang ingin dibaca: ", (folderName) => {
    const folderPath = path.join(__dirname, folderName);
    fs.readdir(folderPath, (err, files) => {
      if (err) throw err;

      console.log(`Menampilkan isi dari folder ${folderName}:`);
      const fileDetails = files.map((file) => {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);
        return {
          namaFile: file,
          extensi: path.extname(file).slice(1),
          jenisFile: path.extname(file).slice(1) === "jpg" ? "gambar" : "text",
          tanggalDibuat: stats.birthtime.toISOString().split("T")[0],
          ukuranFile: (stats.size / 1024).toFixed(1) + "kb",
        };
      });
      console.log(fileDetails);
      rl.close();
    });
  });
};

// Fungsi membaca isi file

// Menemukan file di subfolder
app.findFileRecursive = (dir, fileName) => {
    const files = fs.readdirSync(dir);
  
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
  
      if (stats.isDirectory()) {
        // Jika directory (subfolder lain), maka jalankan pencarian secara rekursif
        const found = app.findFileRecursive(filePath, fileName);
        if (found) return found;
      } else if (file === fileName) {
        // Jika file ditemukan, kembalikan path lengkap file tersebut
        return filePath;
      }
    }
    return null; // File tidak ditemukan
  };

app.readFile = () => {
  rl.question("Masukan Nama File yang ingin dibaca(cth: cerpen.txt): ", (fileName) => {
    const filePath = app.findFileRecursive(__dirname, fileName);

    if (!filePath) {
      console.error("File tidak ditemukan di dalam folder atau subfolder.");
      rl.close();
      return;
    }

    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.error("Gagal membaca file.");
        return rl.close();
      }
      console.log(`Isi dari file ${fileName}:\n\n${data}`);
      rl.close();
    });
  });
};

module.exports = app;
