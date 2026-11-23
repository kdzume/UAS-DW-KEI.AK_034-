/* VIKTOR — THE GLORIOUS EVOLUTION
   Vanilla JavaScript: DOM, events, form, delegation, and dynamic lists.
*/
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const halaman = document.querySelectorAll(".halaman");
  const menu = document.querySelectorAll("nav a");
  const jumlahHalaman = halaman.length;
  let spoilerDibuka = false;

  // 1. Pasang gambar.
  function pasangFoto(kotak) {
    const namaFile = kotak.dataset.file;
    kotak.textContent = namaFile || "Image";
    if (!namaFile) return;

    const gambar = new Image();
    gambar.alt = kotak.dataset.alt || "";

    gambar.addEventListener("load", () => {
      kotak.textContent = "";
      kotak.append(gambar);
    });

    gambar.addEventListener("error", () => {
      kotak.textContent = "Image not found: " + namaFile;
    });

    gambar.src = "assets/images/" + namaFile;
  }

  document.querySelectorAll(".gambar[data-file]").forEach(pasangFoto);

  // 2. Navigasi enam halaman.
  function tampilkanHalaman(index) {
    if (index < 0 || index >= jumlahHalaman) return;

    halaman.forEach((page, i) => {
      page.classList.toggle("aktif", i === index);
    });

    menu.forEach((link, i) => {
      link.classList.toggle("aktif", i === index);

      if (i === index) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    document.documentElement.classList.toggle("tanpa-scroll", index === 0);
    document.body.classList.toggle("tanpa-scroll", index === 0);

    $("progres").style.width =
      ((index + 1) / jumlahHalaman * 100) + "%";

    $("spoiler").classList.toggle("sembunyi", spoilerDibuka);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  menu.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      tampilkanHalaman(Number(link.dataset.n));
    });
  });

  $("awal").addEventListener("click", () => tampilkanHalaman(0));

  $("setuju").addEventListener("click", () => {
    spoilerDibuka = true;
    $("spoiler").classList.add("sembunyi");
  });

  // 3. Tombol pembuka halaman pertama.
  const tombolMulai = $("mulai");
  const teksTombolMulai = tombolMulai.textContent;

  tombolMulai.addEventListener("click", () => {
    tombolMulai.disabled = true;
    tombolMulai.classList.add("menyala");
    tombolMulai.textContent = "Entering the Hexcore...";

    window.setTimeout(() => {
      tampilkanHalaman(1);
      tombolMulai.disabled = false;
      tombolMulai.classList.remove("menyala");
      tombolMulai.textContent = teksTombolMulai;
    }, 450);
  });

  // 4. Read More: membuat dan menghapus paragraf.
  const isiTambahan = [
    "Where it begins: Viktor comes from Zaun and earns his place in Piltover through talent alone. He never forgets which side of the city shaped him.",
    "What drives him: he is not chasing power. He is chasing an answer to a question he has lived with all his life: does pain have to be permanent?",
    "Why it gets complicated: the same wish to help people slowly pushes him toward solutions that are harder and harder to defend."
  ];

  $("btnBacaLagi").addEventListener("click", (event) => {
    const tombol = event.currentTarget;
    const wadah = $("infoTambahan");
    const sedangTerbuka = wadah.childElementCount > 0;

    if (sedangTerbuka) {
      wadah.replaceChildren();
    } else {
      isiTambahan.forEach((isi) => {
        const paragraf = document.createElement("p");
        paragraf.className = "info-baru";
        paragraf.textContent = isi;
        wadah.append(paragraf);
      });
    }

    tombol.textContent = sedangTerbuka ? "Read More" : "Show Less";
    tombol.classList.toggle("terbuka", !sedangTerbuka);
    tombol.setAttribute("aria-expanded", String(!sedangTerbuka));
  });

  // 5. Event delegation untuk tombol detail timeline.
  $("timeline").addEventListener("click", (event) => {
    const tombol = event.target.closest(".btn-detail");
    if (!tombol) return;

    const fase = tombol.closest("li");
    const detail = fase.querySelector(".detail");
    const dibuka = detail.classList.toggle("sembunyi") === false;

    fase.classList.toggle("fase-aktif", dibuka);
    tombol.textContent = dibuka ? "Hide Detail" : "Show Detail";
    tombol.setAttribute("aria-expanded", String(dibuka));
  });

  // 6. Pilihan refleksi dan penjelasan filosofi.
  $("embrace").addEventListener("click", () => {
    $("jawaban").textContent =
      'You chose evolution. Imagine a world without unnecessary pain. But who decides what counts as "unnecessary", and what might be lost when choice disappears?';
  });

  $("human").addEventListener("click", () => {
    $("jawaban").textContent =
      "You chose to remain human. Imperfection and freedom make life personal. But does holding on to what is familiar also mean letting others keep suffering?";
  });

  $("btnFilosofi").addEventListener("click", (event) => {
    const tombol = event.currentTarget;
    const isi = $("filosofiTambahan");
    const dibuka = isi.classList.toggle("sembunyi") === false;

    tombol.textContent = dibuka
      ? "Hide the Deeper Look"
      : "Explore the Philosophy Deeper";

    tombol.setAttribute("aria-expanded", String(dibuka));
  });

  // 7. Mengganti tema terang dan gelap lewat tombol ikon di menu.
  const tombolTema = $("btnTema");

  function ubahTema() {
    const temaTerang = document.body.classList.toggle("tema-terang");

    // Ikon menunjukkan tema tujuan: matahari = pindah ke terang, bulan = pindah ke gelap.
    const label = temaTerang ? "Switch to dark theme" : "Switch to light theme";

    tombolTema.textContent = temaTerang ? "🌙" : "☀️";
    tombolTema.setAttribute("aria-pressed", String(temaTerang));
    tombolTema.setAttribute("aria-label", label);
    tombolTema.setAttribute("title", label);
  }

  // Dicek dulu: kalau tombol belum ada di HTML, bagian lain script tidak ikut berhenti.
  if (tombolTema) {
    tombolTema.addEventListener("click", ubahTema);
  }

  // 8. Daftar kutipan.
  const kutipan = [
    { teks: "You need not suffer anymore.", info: "Viktor, Arcane S2E2" },
    { teks: "In the pursuit of great, we failed to do good.", info: "Viktor, Arcane Season 1" },
    { teks: "When you're going to change the world, you don't ask for permission.", info: "Viktor, Arcane S1E2" },
    { teks: "Evolution has a destination.", info: "Viktor, Arcane Season 2" },
    { teks: "In all timelines, in all possibilities, only you can show me this.", info: "Viktor, Arcane S2E9" }
  ];

  const daftarKutipan = $("daftar");

  function buatKartuKutipan(item) {
    const kartu = document.createElement("article");
    kartu.className = "kartu";

    const teks = document.createElement("p");
    teks.className = "teks-kutipan";
    teks.textContent = item.teks;

    const sumber = document.createElement("small");
    sumber.textContent = item.info;

    const salin = document.createElement("button");
    salin.type = "button";
    salin.className = "btn-salin";
    salin.textContent = "COPY QUOTE";

    const hapus = document.createElement("button");
    hapus.type = "button";
    hapus.className = "btn-hapus";
    hapus.textContent = "DELETE";

    kartu.append(
      teks,
      sumber,
      document.createElement("br"),
      salin,
      hapus
    );

    return kartu;
  }

  function perbaruiPesanKutipan() {
    const jumlah = daftarKutipan.children.length;

    $("pesanKutipan").textContent = jumlah === 0
      ? 'All quotes removed. Press "Restore All Quotes" to bring them back.'
      : `${jumlah} of ${kutipan.length} quotes shown.`;
  }

  function pulihkanKutipan() {
    daftarKutipan.replaceChildren();

    kutipan.forEach((item) => {
      daftarKutipan.append(buatKartuKutipan(item));
    });

    perbaruiPesanKutipan();
  }

  daftarKutipan.addEventListener("click", async (event) => {
    const tombolSalin = event.target.closest(".btn-salin");
    const tombolHapus = event.target.closest(".btn-hapus");

    if (tombolSalin) {
      const teks = tombolSalin
        .closest(".kartu")
        .querySelector(".teks-kutipan").textContent;

      try {
        await navigator.clipboard.writeText(teks);
        tombolSalin.textContent = "COPIED!";
      } catch {
        tombolSalin.textContent = "COPY UNAVAILABLE";
      }

      window.setTimeout(() => {
        if (tombolSalin.isConnected) {
          tombolSalin.textContent = "COPY QUOTE";
        }
      }, 1300);
    }

    if (tombolHapus) {
      tombolHapus.closest(".kartu").remove();
      perbaruiPesanKutipan();
    }
  });

  $("btnPulihkan").addEventListener("click", pulihkanKutipan);

  // Kutipan sorotan.
  let indexSorotan = 0;

  function tampilkanSorotan() {
    $("teksSorotan").textContent =
      '"' + kutipan[indexSorotan].teks + '"';

    $("infoSorotan").textContent = kutipan[indexSorotan].info;
  }

  $("btnQuoteLain").addEventListener("click", () => {
    indexSorotan = (indexSorotan + 1) % kutipan.length;
    tampilkanSorotan();
  });

  pulihkanKutipan();
  tampilkanSorotan();

  // 9. Pemutar musik.
  const audio = $("lagu");
  const tombolPlay = $("play");

  tombolPlay.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        $("status").textContent =
          "Audio could not be played. Check assets/audio/lagu.mp3.";
      }
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => {
    tombolPlay.textContent = "PAUSE";
    $("status").textContent = "Now playing...";
  });

  audio.addEventListener("pause", () => {
    tombolPlay.textContent = "PLAY";
    $("status").textContent = "Paused";
  });

  audio.addEventListener("error", () => {
    $("status").textContent =
      "Audio file not found. Add lagu.mp3 to assets/audio/.";
  });

  audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      $("progresLagu").value =
        (audio.currentTime / audio.duration) * 100;
    }
  });

  $("progresLagu").addEventListener("input", (event) => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime =
        (Number(event.target.value) / 100) * audio.duration;
    }
  });

  $("volume").addEventListener("input", (event) => {
    audio.volume = Number(event.target.value);
  });

  audio.volume = Number($("volume").value);

  // 10. Galeri meme.
  const memes = [
    { file: "viktor-meme.jpg", caption: '"I solved human suffering. Mostly."' },
    { file: "meme-1.jpg", caption: "No need to question, ain't it?" },
    { file: "meme-2.jpg", caption: "ZZZ..." },
    { file: "meme-3.jpg", caption: "Kei rn fr..." }
  ];

  let indexMeme = 0;

  function tampilkanMeme(index) {
    indexMeme = index;

    const kotak = $("meme");
    kotak.dataset.file = memes[index].file;
    kotak.dataset.alt = memes[index].caption;

    pasangFoto(kotak);
    $("caption").textContent = memes[index].caption;
  }

  const galeri = $("galeri");

  memes.forEach((item, index) => {
    const gambar = document.createElement("button");
    gambar.type = "button";
    gambar.className = "gambar item-galeri";
    gambar.dataset.file = item.file;
    gambar.dataset.alt = item.caption;

    gambar.setAttribute("aria-label", "Show meme " + (index + 1));

    gambar.addEventListener("click", () => {
      tampilkanMeme(index);
    });

    pasangFoto(gambar);
    galeri.append(gambar);
  });

  $("ganti").addEventListener("click", () => {
    tampilkanMeme((indexMeme + 1) % memes.length);
  });

  tampilkanMeme(0);

  // 11. Form pendapat dan komentar.
  const form = $("formPendapat");
  const inputNama = $("inputNama");
  const inputKomentar = $("inputKomentar");
  const pilihanKesan = $("pilihanKesan");
  const daftarKomentar = $("daftarKomentar");

  function perbaruiPreview() {
    $("previewNama").textContent =
      inputNama.value.trim() || "Your Name";

    $("previewKesan").textContent = pilihanKesan.value;

    $("previewKomentar").textContent =
      inputKomentar.value.trim() || "Your thoughts will appear here.";
  }

  function tampilkanPesanForm(teks, jenis) {
    const pesan = $("pesanForm");
    pesan.textContent = teks;
    pesan.classList.remove("pesan-error", "pesan-sukses");
    pesan.classList.add(jenis);
  }

  [inputNama, inputKomentar].forEach((input) => {
    input.addEventListener("input", () => {
      input.removeAttribute("aria-invalid");
      perbaruiPreview();
    });
  });

  pilihanKesan.addEventListener("change", perbaruiPreview);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nama = inputNama.value.trim();
    const isi = inputKomentar.value.trim();

    if (!nama || !isi) {
      if (!nama) inputNama.setAttribute("aria-invalid", "true");
      if (!isi) inputKomentar.setAttribute("aria-invalid", "true");

      tampilkanPesanForm(
        "Please fill in your name and thoughts.",
        "pesan-error"
      );

      (!nama ? inputNama : inputKomentar).focus();
      return;
    }

    const item = document.createElement("li");
    item.className = "komentar";

    const kepala = document.createElement("p");
    const namaPengunjung = document.createElement("strong");
    namaPengunjung.textContent = nama;

    const labelKesan = document.createElement("span");
    labelKesan.className = "lencana";
    labelKesan.textContent = pilihanKesan.value;

    kepala.append(namaPengunjung, " ", labelKesan);

    const isiKomentar = document.createElement("p");
    isiKomentar.className = "komentar-isi";
    isiKomentar.textContent = isi;

    const hapus = document.createElement("button");
    hapus.type = "button";
    hapus.className = "btn-hapus-komentar";
    hapus.textContent = "Delete";

    item.append(kepala, isiKomentar, hapus);
    daftarKomentar.append(item);

    perbaruiJumlahKomentar();
    form.reset();
    perbaruiPreview();

    tampilkanPesanForm(
      "Thank you, " + nama + "! Your thought was added below.",
      "pesan-sukses"
    );
  });

  // Menghitung jumlah komentar.
  function perbaruiJumlahKomentar() {
    const jumlah = daftarKomentar.children.length;

    $("jumlahKomentar").textContent = jumlah;
    $("kosongKomentar").classList.toggle("sembunyi", jumlah > 0);
  }

  // Event delegation untuk tombol hapus komentar.
  daftarKomentar.addEventListener("click", (event) => {
    const tombolHapus = event.target.closest(".btn-hapus-komentar");
    if (!tombolHapus) return;

    tombolHapus.closest(".komentar").remove();
    perbaruiJumlahKomentar();
  });

  perbaruiPreview();
  perbaruiJumlahKomentar();

  // Mulai dari halaman intro.
  tampilkanHalaman(0);
})();