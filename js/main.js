document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');

  burger?.addEventListener('click', () => {
    nav?.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', nav?.classList.contains('is-open') ? 'true' : 'false');
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger?.setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const track = slider.querySelector('.slider-track');
    const prev = slider.querySelector('[data-prev]');
    const next = slider.querySelector('[data-next]');
    if (!track) return;

    const getStep = () => {
      const firstItem = track.children[0];
      if (!firstItem) return 320;
      const gap = parseInt(getComputedStyle(track).gap || '0', 10);
      return firstItem.getBoundingClientRect().width + gap;
    };

    prev?.addEventListener('click', () => track.scrollBy({ left: -getStep(), behavior: 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: getStep(), behavior: 'smooth' }));
  });

  document.querySelectorAll('.read-more').forEach((button) => {
    button.addEventListener('click', () => {
      const moreText = button.previousElementSibling;
      moreText?.classList.toggle('open');
      button.textContent = moreText?.classList.contains('open') ? 'Скрыть' : 'Подробнее';
    });
  });

  initServices();
  initDoctorModal();
});

const servicesData = [
  { title: 'Диагностика специалиста', items: [['Консультация врача косметолога', '1000 ₽'], ['Консультация врача дерматолога', '2000 ₽'], ['Повторная консультация врача дерматолога', '1500 ₽']] },
  { title: 'Ботулинотерапия', items: [['Диспорт', '140 ₽'], ['Ксеомин', '320 ₽'], ['Релатокс', '320 ₽'], ['Лечение гипергидроза — Ксеомин', '20000 ₽'], ['Лечение гипергидроза — Релатокс', '20000 ₽'], ['Лечение гипергидроза — Диспорт', '17000 ₽']] },
  { title: 'Биоревитализация / Биорепарация', items: [['Femegyl R 1,5 мл', '8000 ₽'], ['Femegyl R 3 мл', '10000 ₽'], ['Filorga NCTF 135 HA 1,5 мл', '8500 ₽'], ['Filorga NCTF 135 HA 3 мл', '12000 ₽'], ['Novacutan Ybio', '14500 ₽'], ['Novacutan Sbio', '14500 ₽'], ['Novacutan Ybio + Sbio', '26000 ₽'], ['MesoXantin F199', '16000 ₽'], ['MesoWharton P199', '16000 ₽'], ['Biogel T Line 2,2 мл', '14000 ₽'], ['Plinest 2 мл', '16000 ₽'], ['MiraLine Hydro 2 мл', '10600 ₽'], ['Биоревитализация шеи', '8000 ₽'], ['Neauvia Hydro Deluxe 2,5 мл', '15000 ₽']] },
  { title: 'Описание врача', items: [['Специализация', '—']] },
  { title: 'Аппаратные услуги косметолога-эстетиста', items: [['RF-лифтинг лица', '3500 ₽'], ['RF-лифтинг лица, шеи и декольте', '4200 ₽'], ['Микротоковая терапия лица', '2800 ₽'], ['Микротоковая терапия периорбитальной области', '1800 ₽']] },
  { title: 'Коллагентерапия', items: [['Сферогель Long Fine 0.5 мл', '16000 ₽'], ['Cферогель Medium 0,5 мл', '10700 ₽'], ['Cферогель Medium 1 мл', '17400 ₽'], ['Radiesse 1,5 мл', '28000 ₽'], ['Radiesse 3 мл', '38000 ₽'], ['Radiesse 1,5 мл Lidocaine', '28000 ₽'], ['Collost micro 50 мг', '14000 ₽'], ['Collost Micro 150 мг', '22000 ₽'], ['Ellagen HA 100 мг', '20000 ₽'], ['Ellagen HA 200 мг', '30000 ₽'], ['Ellagen HA 300 мг', '40000 ₽'], ['Ellagen 1000 мг', '60000 ₽']] },
  { title: 'Контурная пластика', items: [['КП губ', '16500 ₽'], ['КП скуловой области', '16500 ₽'], ['КП носогубных складок', '16500 ₽'], ['КП носослезных борозд', '17500 ₽'], ['КП височной области', '16500 ₽'], ['КП щечной области', '16500 ₽'], ['КП подбородочной области', '16500 ₽'], ['КП углов нижней челюсти', '16500 ₽'], ['КП носа', '21500 ₽'], ['КП лба', '15000 ₽'], ['Бланширование', '19300 ₽'], ['КП кистей', '16500 ₽']] },
  { title: 'Лазерная шлифовка растяжек CO2 Capello', items: [['Лазерная шлифовка груди', '16000 ₽'], ['Лазерная шлифовка плеч', '16000 ₽'], ['Лазерная шлифовка живота', '16000 ₽'], ['Лазерная шлифовка ягодиц', '16000 ₽'], ['Лазерная шлифовка бедер', '16000 ₽']] },
  { title: 'Лазерная шлифовка CO2 Capello', items: [['ЛШ Веки', '10000 ₽'], ['ЛШ Щеки', '10000 ₽'], ['ЛШ Лоб', '10000 ₽'], ['ЛШ Нос', '8000 ₽'], ['ЛШ Подбородок', '10000 ₽'], ['ЛШ Лицо полностью', '16000 ₽'], ['ЛШ Рубец до 3 см', '6000 ₽'], ['ЛШ Рубец 3-10 см', '8000 ₽'], ['ЛШ Рубец более 10 см', '10000 ₽']] },
  { title: 'Нитевой лифтинг', items: [['Excellence Visage 2', '20000 ₽'], ['Excellence Visage', '48000 ₽'], ['Excellence Visage Soft', '37000 ₽'], ['Excellence Visage NAMICA', '53000 ₽'], ['Light Lift Needle Blunt', '50000 ₽']] },
  { title: 'Профессиональная чистка лица (косметолог-эстетист)', items: [['Пробуждение энергии — уход-программа', '4500 ₽'], ['Синергия чистоты — гигиеническая чистка', '3800 ₽'], ['Время вспять — уход-программа', '4500 ₽'], ['AntiAcne-комплекс Acnon', '3800 ₽'], ['Деликатная чувственность — уход-программа', '4000 ₽'], ['Чистая нота — атравматическая чистка', '3500 ₽'], ['Чистка спины', '4000 ₽'], ['Профессиональная чистка лица', '3500 ₽'], ['Моментальный эффект — уход-программа', '4500 ₽']] },
  { title: 'Лазерный душ CO2 Capello', items: [['Лазерный душ — лицо', '8000 ₽'], ['Лазерный душ — лицо + шея + декольте', '15000 ₽'], ['Лазерный душ — зона декольте', '8000 ₽'], ['Лазерный душ — шея', '8000 ₽']] },
  { title: 'Лазерная эпиляция Capello Diode', items: [['ЛЭ Все тело BASE', '8000 ₽'], ['ЛЭ Все тело TOTAL', '10000 ₽'], ['ЛЭ Классическое бикини', '1800 ₽'], ['ЛЭ Тотальное бикини', '2800 ₽'], ['ЛЭ Ноги полностью', '3800 ₽'], ['ЛЭ Бедра', '2200 ₽'], ['ЛЭ Голени', '2200 ₽'], ['Лазерная эпиляция', '1100 ₽']] },
  { title: 'Массажные комплексы', items: [['Лифтинг-массаж лица, шеи и декольте + RF-лифтинг', '4500 ₽'], ['Лимфодренажный массаж лица + микротоки', '4000 ₽'], ['Лимфодренажный массаж лица', '2000 ₽'], ['Лифтинг-массаж лица, шеи и декольте', '2000 ₽']] },
  { title: 'Мезотерапия', items: [['Мезотерапия лица', '2800 ₽'], ['Мезотерапия периорбитальной области', '2800 ₽'], ['P-Shine глаза', '2800 ₽'], ['P-Shine лицо', '4000 ₽'], ['Hair X Vita Line B+', '3000 ₽'], ['Инъекции кортикостероидов', '4500 ₽'], ['Мезотерапия волосистой части головы', '3000 ₽'], ['F-Hair 2 мл', '3000 ₽'], ['DM-Lift лицо', '4000 ₽'], ['Hair Men 1,5 мл', '3000 ₽']] },
  { title: 'SMAS-лифтинг ULTRAFORMER 3', items: [['СМАС Шея', '30000 ₽'], ['СМАС Подбородок', '18000 ₽'], ['СМАС Лицо полностью + подбородок', '45000 ₽'], ['СМАС Лицо + подбородок + шея', '50000 ₽'], ['СМАС Лицо + подбородок + шея + декольте', '65000 ₽'], ['СМАС Верхняя треть лица полностью', '20000 ₽'], ['СМАС Декольте', '30000 ₽'], ['СМАС Нижнее веко + маляр + височная область', '18000 ₽'], ['СМАС Подбородок + нижняя треть + брыли', '28000 ₽']] },
  { title: 'Химический пилинг (косметолог-эстетист)', items: [['Пилинг Essence Peel', '4000 ₽'], ['Пилинг ApplePeel', '4000 ₽'], ['Пилинг Золушки', '5000 ₽'], ['Пилинг BioRePeel CL', '4000 ₽'], ['Желтый пилинг BLOCK AGE PEEL', '4000 ₽'], ['Пилинг ISecret', '4000 ₽']] },
  { title: 'Профессиональная чистка лица (врач дерматолог-косметолог)', items: [['Гигиеническая чистка + поверхностный пилинг', '4500 ₽'], ['AntiAcne-комплекс Acnon', '3800 ₽'], ['Атравматическая чистка', '3500 ₽'], ['Гигиеническая чистка', '3800 ₽'], ['AntiAcne-комплекс Lipacid', '3800 ₽']] },
  { title: 'Микроигольчатый RF-лифтинг VIRTUE', items: [['Лицо полностью VIRTUE RF', '35000 ₽'], ['Лицо + шея VIRTUE RF', '45000 ₽'], ['Лицо + шея + декольте VIRTUE RF', '55000 ₽'], ['Область шеи VIRTUE RF', '30000 ₽'], ['Область декольте VIRTUE RF', '30000 ₽'], ['Зона орбиты VIRTUE RF', '25000 ₽'], ['Тыльная сторона кистей VIRTUE RF', '30000 ₽'], ['Область живота VIRTUE RF', '35000 ₽'], ['Область бедер VIRTUE RF', '35000 ₽'], ['Область ягодиц VIRTUE RF', '35000 ₽']] },
  { title: 'Удаление сосудистых дефектов (IPL-система) Capello', items: [['Удаление сосудов — все лицо', '14000 ₽'], ['Удаление сосудов — крылья носа', '6000 ₽'], ['Удаление сосудов — 1 элемент', '4000 ₽'], ['Удаление сосудов — верхняя треть', '8000 ₽'], ['Удаление сосудов — средняя треть', '8000 ₽'], ['Удаление сосудов — нижняя треть', '8000 ₽']] },
  { title: 'Фотоомоложение (IPL-терапия) Capello', items: [['Фотоомоложение лица', '8000 ₽'], ['Фотоомоложение декольте', '8000 ₽'], ['Фотоомоложение лицо + шея + декольте', '14000 ₽']] },
  { title: 'Химический пилинг (врач дерматолог-косметолог)', items: [['Срединный пилинг ТСА 15%-25%', '4000 ₽'], ['Пилинг BioRePeel CL3', '4000 ₽'], ['Пилинг PeachPeel', '4000 ₽'], ['Пилинг BIOT-2', '4000 ₽'], ['Поверхностный пилинг Mediderma', '3000 ₽'], ['Пилинг PRX-T33', '4200 ₽'], ['Желтый пилинг Mediderma', '4200 ₽'], ['Срединный пилинг Джесснера', '3500 ₽']] },
  { title: 'Удаление гиперпигментации (IPL-система) Capello', items: [['Удаление пигментации — все лицо', '14000 ₽'], ['Удаление пигментации — верхняя треть', '8000 ₽'], ['Удаление пигментации — средняя треть', '8000 ₽'], ['Удаление пигментации — нижняя треть', '8000 ₽'], ['Удаление пигментации — декольте + плечи', '8000 ₽'], ['Удаление пигментации до 4 см', '4000 ₽']] },
  { title: 'Химическая липоредукция', items: [['Стройное лицо 0,5 мл', '4500 ₽'], ['Стройное лицо 1 мл', '8000 ₽'], ['Стройное лицо 2 мл', '13000 ₽'], ['Стройное лицо 4 мл', '20000 ₽'], ['Стройное тело 2 мл', '13000 ₽'], ['Стройное тело 4 мл', '20000 ₽'], ['Стройное тело 6 мл', '25000 ₽']] },
  { title: 'Плазмотерапия', items: [['Plasmolifting 1 пробирка', '5000 ₽'], ['Plasmolifting 2 пробирки', '8000 ₽'], ['Плазмотерапия лица', '5000 ₽'], ['Плазмотерапия волосистой части головы', '5000 ₽']] },
  { title: 'Лазерный пилинг CO2 Capello', items: [['Лазерный пилинг Лицо', '10000 ₽'], ['Лазерный пилинг Шея', '10000 ₽'], ['Лазерный пилинг Зона декольте', '10000 ₽'], ['Лазерный пилинг Лицо + шея + декольте', '24000 ₽']] },
  { title: 'Лазерное удаление папиллом CO2-лазер Capello', items: [['Удаление папиллом 1 шт', '1000 ₽'], ['Удаление папиллом до 5 шт', '4000 ₽'], ['Удаление папиллом 5-10 шт', '6000 ₽'], ['Удаление папиллом более 10 шт', '10000 ₽']] },
];

function initServices() {
  const categoriesContainer = document.querySelector('#servicesCategories');
  const servicesList = document.querySelector('#servicesList');
  const activeServiceTitle = document.querySelector('#activeServiceTitle');
  if (!categoriesContainer || !servicesList || !activeServiceTitle) return;

  const renderServices = (index = 0) => {
    const service = servicesData[index];
    activeServiceTitle.textContent = service.title;
    servicesList.innerHTML = service.items.map(([name, price]) => `<div class="service-price-row"><span class="service-name">${name}</span><span class="service-price">${price}</span></div>`).join('');
    categoriesContainer.querySelectorAll('.service-tab').forEach((tab, tabIndex) => tab.classList.toggle('active', tabIndex === index));
  };

  categoriesContainer.innerHTML = servicesData.map((service, index) => `<button class="service-tab ${index === 0 ? 'active' : ''}" data-index="${index}" type="button">${service.title}</button>`).join('');
  categoriesContainer.addEventListener('click', (event) => {
    const button = event.target.closest('.service-tab');
    if (!button) return;
    renderServices(Number(button.dataset.index));
  });
  renderServices(0);
}

const doctorsData = [
  ['Сергеева Маргарита Валерьевна', 'Главный врач, дерматолог, врач-косметолог', 'Главный врач клиники. Специализируется на дерматологии, инъекционных и эстетических методиках.'],
  ['Медведева Марина Алексеевна', 'Врач дерматолог, косметолог', 'Помогает пациентам подобрать безопасный и эффективный план эстетического ухода.'],
  ['Королёва Ольга Олеговна', 'Врач дерматолог, косметолог', 'Работает с эстетическими процедурами и индивидуальными программами улучшения качества кожи.'],
  ['Гудожникова Анна Алексеевна', 'Эстетист, специалист лазерной эпиляции', 'Специалист по уходовым процедурам и лазерной эпиляции.'],
  ['Макарова Анна Сергеевна', 'Врач дерматолог, косметолог', 'Проводит консультации и помогает выбрать подходящие процедуры.'],
  ['Карцева Анна Алексеевна', 'Эстетист, специалист лазерной эпиляции', 'Работает с аппаратными и уходовыми направлениями.'],
  ['Исмаилова Эльвира Хандулаевна', 'Врач дерматолог, миколог, косметолог', 'Специализируется на дерматологии, микологии и косметологии.'],
  ['Кондаурова Анастасия Юрьевна', 'Врач-ординатор', 'Помогает команде врачей и работает в рамках медицинского направления клиники.'],
];

function initDoctorModal() {
  const modal = document.querySelector('#doctorModal');
  const close = modal?.querySelector('.modal-close');
  const name = modal?.querySelector('#modalDoctorName');
  const role = modal?.querySelector('#modalDoctorRole');
  const text = modal?.querySelector('#modalDoctorText');
  if (!modal || !name || !role || !text) return;

  document.querySelectorAll('.doctor-more').forEach((button) => {
    button.addEventListener('click', () => {
      const doctor = doctorsData[Number(button.dataset.doctor)];
      if (!doctor) return;
      name.textContent = doctor[0];
      role.textContent = doctor[1];
      text.textContent = doctor[2];
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };
  close?.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
}
