const previousVolumes = { water: 50, fire: 50, cafe: 50, noise: 50 }; // 預設恢復音量 //
const isMuted = { water: true, fire: true, cafe: true, noise: true }; // 初始為靜音 //

window.addEventListener('load', () => { // 頁面與資源載入後執行 //
  updateClock(); // 更新時鐘 //
  setInterval(updateClock, 1000); // 設定每秒更新 //
  
  ['water', 'fire', 'cafe', 'noise'].forEach(id => { // 初始化定位 //
    const slider = document.getElementById(`slider-${id}`); // 取得滑軌 //
    positionTextOnly(id, slider.value); // 設定文字座標 //
  }); //
}); //

window.addEventListener('resize', () => { // 視窗縮放時 //
  ['water', 'fire', 'cafe', 'noise'].forEach(id => { // 遍歷所有軌道 //
    const slider = document.getElementById(`slider-${id}`); // 取得滑軌 //
    positionTextOnly(id, slider.value); // 重新定位文字 //
  }); //
}); //

function updateClock() { // 處理右側時鐘邏輯 //
  const now = new Date(); // 取得系統時間 //
  const hours = String(now.getHours()).padStart(2, '0'); // 時 //
  const minutes = String(now.getMinutes()).padStart(2, '0'); // 分 //
  const seconds = String(now.getSeconds()).padStart(2, '0'); // 秒 //
  
  document.getElementById('clock-display').textContent = `${hours}:${minutes}:${seconds}`; // 寫入節點 //
} //

function positionTextOnly(id, value) { // 處理滑塊文字 X 軸偏移 //
  const text = document.getElementById(`text-${id}`); // 取文字元素 //
  const slider = document.getElementById(`slider-${id}`); // 取滑軌元素 //
  
  const thumbWidth = 66; // 必須與 CSS 設定之滑塊寬度相同 //
  const rect = slider.getBoundingClientRect(); // 取得渲染寬度 //
  const sliderWidth = rect.width > 0 ? rect.width : slider.offsetWidth; // 防呆抓取寬度 //
  const trackWidth = sliderWidth - thumbWidth; // 計算可滑動範圍 //
  const leftPos = (value / 100) * trackWidth; // 計算座標 //
  
  text.style.left = `${leftPos}px`; // 套用座標 //
  text.textContent = `${value}%`; // 更新數值 //
} //

function updateVolume(id, value) { // 實質控制音量與播放的邏輯 //
  const audio = document.getElementById(`audio-${id}`); // 取音訊元素 //
  const btn = document.querySelector(`[data-id="${id}"] .mute-btn`); // 取按鈕元素 //
  const vol = value / 100; // 換算比例 //

  audio.volume = vol; // 套用音訊音量 //
  
  if (vol > 0) { // 若拉大於 0 //
    if (audio.paused) { // 若處於暫停狀態 //
      audio.play().catch(err => console.error(`音訊播放失敗 (${id}):`, err)); // 執行播放 //
    } //
    isMuted[id] = false; // 標記為非靜音 //
    btn.classList.remove('muted'); // 移除靜音樣式 //
  } else { // 若拉回 0 //
    audio.pause(); // 暫停以釋放資源 //
    isMuted[id] = true; // 標記為靜音 //
    btn.classList.add('muted'); // 加上靜音樣式 //
  } //

  positionTextOnly(id, value); // 連動文字座標更新 //
} //

function toggleMute(id) { // 左側按鈕點擊切換邏輯 //
  const slider = document.getElementById(`slider-${id}`); // 取得滑軌 //

  if (isMuted[id]) { // 若目前為靜音 //
    const restoreVal = previousVolumes[id] > 0 ? previousVolumes[id] : 50; // 取出前次音量 //
    slider.value = restoreVal; // 還原滑桿數值 //
    updateVolume(id, restoreVal); // 觸發音量更新 //
  } else { // 若目前為播放中 //
    previousVolumes[id] = slider.value; // 記憶當前數值 //
    slider.value = 0; // 滑桿歸零 //
    updateVolume(id, 0); // 觸發暫停 //
  } //
} //