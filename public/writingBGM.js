// 工具函数：将秒数格式化为 mm:ss
function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// 预倒计时设置
const preCountdownDuration = 180; // 预倒计时持续时间（秒）
const preMusicDuration = 10; // 预铃时间（秒）
const preMusicMaxVolume = 0.05; // 预铃最大音量

// 倒计时功能
async function startCountdown(startTime, lastingTime, folder, preMusic) {
    const startDateTime = new Date();
    const [startHour, startMin] = startTime.split(':').map(Number);
    startDateTime.setHours(startHour, startMin, 0, 0);

    const checkInterval = setInterval(() => {
        const currentTime = new Date();
        const timeDiff = (startDateTime - currentTime) / 1000;
        if (timeDiff <= 0) {
            clearInterval(checkInterval);
            return;
        }
        if (timeDiff < preCountdownDuration) {
            const adjustedPreCountdown = Math.max(timeDiff, 0);
            startPreCountdown(adjustedPreCountdown, folder, preMusic, lastingTime);
            clearInterval(checkInterval);
        } else {
            if (timeDiff <= preCountdownDuration + 3 * 60) {
                setTimeout(() => startPreCountdown(preCountdownDuration, folder, preMusic, lastingTime), (timeDiff - preCountdownDuration) * 1000);
                clearInterval(checkInterval);
            }
        }
    }, 1000);
}

// 预倒计时
function startPreCountdown(adjustedDuration, folder, preMusic, lastingTime) {
    let preCountdown = adjustedDuration;
    document.getElementById("writingBGMShow").style.display = "block";
    const preInterval = setInterval(() => {
        document.getElementById('writingBGMTime').innerText = formatTime(preCountdown);
        preCountdown--;

        if (preCountdown === preMusicDuration) {
            playPreMusic(preMusic);
        }

        if (preCountdown < 0) {
            clearInterval(preInterval);
            startMainCountdown(lastingTime, folder);
        }
    }, 1000);
}

// 播放预音乐并淡出
function playPreMusic(preMusic) {
    const audio = new Audio(preMusic);
    audio.volume = preMusicMaxVolume; // 设置最大音量为 30%
    audio.play().catch((error) => console.error('音频播放失败:', error));

    setTimeout(() => {
        const fadeInterval = setInterval(() => {
            if (audio.volume > 0) {
                audio.volume = Math.max(audio.volume - 0.1, 0);
            } else {
                clearInterval(fadeInterval);
                audio.pause();
                audio.currentTime = 0;
            }
        }, 100);
    }, preMusicDuration * 1000);
}

// 正式倒计时与音乐播放
async function startMainCountdown(lastingTime, folder) {
    let mainCountdown = lastingTime;
    let currentAudio = await playRandomMusic(folder, mainCountdown);

    const mainInterval = setInterval(() => {
        document.getElementById('writingBGMTime').innerText = formatTime(mainCountdown);
        mainCountdown--;

        if (mainCountdown < 0) {
            clearInterval(mainInterval);
            document.getElementById("writingBGMShow").style.display = "none";
            if (currentAudio) {
                fadeOutCurrentMusic(currentAudio, () => {
                    console.log('倒计时结束，音乐已停止');
                });
                currentAudio = null; // 防止再次引用
            }
        }
    }, 1000);
}

// 播放随机音乐并处理淡入淡出
async function playRandomMusic(folder, mainCountdown) {
    try {
        const randomMusicFile = await pickRandomFileFromFolder(folder);
        if (!randomMusicFile) {
            console.error('未找到音乐文件');
            return null;
        }
        const audio = new Audio(randomMusicFile);
        audio.volume = 0;
        audio.play().catch((error) => {
            console.error('音频播放失败:', error);
        });

        audio.onerror = () => {
            console.error('音频加载错误:', randomMusicFile);
        };

        const fadeInInterval = setInterval(() => {
            if (audio.volume < 1) {
                audio.volume = Math.min(audio.volume + 0.1, 1);
            } else {
                clearInterval(fadeInInterval);
            }
        }, 100);

        audio.onended = async () => {
            if (mainCountdown > 0) {
                await fadeOutCurrentMusic(audio, () => {
                    playRandomMusic(folder, mainCountdown);
                });
            }
        };

        return audio;

    } catch (error) {
        console.error('播放音乐时出错:', error);
        return null;
    }
}

// 淡出当前音乐
function fadeOutCurrentMusic(audio, callback) {
    if (!audio) {
        console.error('audio 对象无效，无法淡出音乐');
        return;
    }

    const fadeOutInterval = setInterval(() => {
        if (audio.volume > 0) {
            audio.volume = Math.max(audio.volume - 0.1, 0);
        } else {
            clearInterval(fadeOutInterval);
            audio.pause();
            audio.currentTime = 0;
            if (callback) callback();
        }
    }, 100);
}

// 从文件夹中获取音乐文件列表
async function fetchMusicFiles(folderPath) {
    try {
        const musicFiles = await window.fileAPI.getMusicFiles(folderPath);
        console.log('音乐文件数组:', musicFiles);
        return musicFiles;
    } catch (error) {
        console.error('读取音乐文件失败:', error);
        return [];
    }
}

// 从文件夹中随机选取文件
async function pickRandomFileFromFolder(folder) {
    try {
        const musicFiles = await fetchMusicFiles(folder);
        if (musicFiles.length === 0) {
            console.error('音乐文件夹为空:', folder);
            return null;
        }
        const randomIndex = Math.floor(Math.random() * musicFiles.length);
        console.log('随机选取的音乐文件:', musicFiles[randomIndex]);
        return musicFiles[randomIndex];
    } catch (error) {
        console.error('获取音乐文件时出错:', error);
        return null;
    }
}

// 等待页面加载后启动倒计时
document.addEventListener('DOMContentLoaded', async () => {
    const configJson = await window.fileAPI.readConfig('config.json');
    const startTime = configJson.extension.writingBGM.startTime;
    const lastingTime = configJson.extension.writingBGM.lasting * 60;
    const folder = configJson.extension.writingBGM.BGMFolder;
    const preMusic = '../resource/ringtone.mp3';

    await startCountdown(startTime, lastingTime, folder, preMusic);
});
