//////预定义//////
// 将秒数格式化为 mm:ss
function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}
// 所需参数
let freshGap = 1; // 刷新间隔（秒）
let audioOnPlay = false; // 是否正在播放音乐
let currentAudio = null; // 当前播放的音乐
//////倒计时部分//////
async function startCountdown(startTime, lastingTime, musicFiles, preCountdownDuration, tempFolderPath, volume) {
    const startDateTime = new Date();
    const [startHour, startMin] = startTime.split(':').map(Number);
    startDateTime.setHours(startHour, startMin, 0, 0);
    console.log('开始时间：', startDateTime);
    let checkInterval = setInterval(() => {
        const currentTime = new Date();
        const timeDiff = (startDateTime - currentTime) / 1000; // 计算时间差（秒）
        if (timeDiff <= preCountdownDuration + 3 * 60 + 45 && timeDiff > 0) {
            //freshGap = 1;
            //clearInterval(checkInterval);
            //checkInterval = setInterval(arguments.callee, freshGap * 1000); // 重新设置定时器
            //console.log('缩短刷新间隔以提高精度');
        }
        if (timeDiff <= 0) {
            clearInterval(checkInterval);
            console.log('不开始倒计时');
            return;
        }
        if (timeDiff < preCountdownDuration) {
            const adjustedPreCountdown = Math.max(timeDiff, 0);
            startPreCountdown(adjustedPreCountdown, musicFiles, lastingTime, tempFolderPath, volume);
            console.log('调整预倒计时时间：', adjustedPreCountdown);
            clearInterval(checkInterval);
        } else {
            if (timeDiff <= preCountdownDuration + 3 * 60) {
                setTimeout(() => startPreCountdown(preCountdownDuration, musicFiles, lastingTime, tempFolderPath, volume), (timeDiff - preCountdownDuration) * 1000);
                clearInterval(checkInterval);
                console.log('预倒计时开始');
            }
        }
    }, (freshGap * 1000));
}
async function startPreCountdown(Duration, musicFiles, lastingTime, tempFolderPath, volume) {
    let preCountdown = Duration;
    document.getElementById("writingBGMShow").style.display = "block";
    const preInterval = setInterval(() => {
        document.getElementById('writingBGMTime').innerText = formatTime(preCountdown);
        preCountdown--;
        if (preCountdown < 0) {
            clearInterval(preInterval);
            startMainCountdown(lastingTime, musicFiles, tempFolderPath, volume);
        }
    }, 1000);
}
async function startMainCountdown(lastingTime, musicFiles, tempFolderPath, volume) {
    let mainCountdown = lastingTime;
    audioOnPlay = true;
    // 自动设置系统音量
    const configJson = await window.fileAPI.readConfig('config.json');
    const systemVolumeSet = configJson.extension.writingBGM.systemVolumeSet;
    const systemVolume = configJson.extension.writingBGM.systemVolume;
    const originalSystemVolume = await window.wAPI.getVolume();
    const systemMuted = await window.wAPI.getMuted();
    if (systemVolumeSet) {
        if (systemMuted) {
            window.wAPI.setMuted(false);
        }
        window.wAPI.setVolume(systemVolume);
    };
    console.log('播放状态参数：', audioOnPlay);
    console.log('主倒计时开始');
    document.getElementById('writingBGMTime').innerText = formatTime(mainCountdown);
    document.getElementById('writingBGMDetail').innerText = '正在进行';
    document.getElementById("writingBGMShow").style.display = "block";
    playAudioLoop(musicFiles, volume, 1000, 1000, tempFolderPath);
    const mainInterval = setInterval(async () => {
        document.getElementById('writingBGMTime').innerText = formatTime(mainCountdown);
        mainCountdown--;
        if (mainCountdown <= 1) {
            audioOnPlay = false;
            console.log('播放状态参数：', audioOnPlay);
            stopCurrentAudio(1000);
        }
        if (mainCountdown < 0) {
            clearInterval(mainInterval);
            audioOnPlay = false;
            document.getElementById("writingBGMShow").style.display = "none";
            console.log('倒计时结束');
            if (systemVolumeSet) {
                window.wAPI.setVolume(originalSystemVolume);
                if (systemMuted) {
                    window.wAPI.setMuted(true);
                }
            };
        }
    }, 1000);
}

//////音乐播放部分//////
// 淡入
function fadeInAudio(audioElement, volume, duration) {
    let targetVolume = volume / 100;
    let step = targetVolume / (duration / 100);
    audioElement.volume = 0;
    let fadeInterval = setInterval(() => {
        if (audioElement.volume < targetVolume) {
            audioElement.volume = Math.min(audioElement.volume + step, targetVolume);
        } else {
            clearInterval(fadeInterval);
        }
    }, 100);
}
// 淡出
function fadeOutAudio(audioElement, duration) {
    let step = audioElement.volume / (duration / 100);
    let fadeInterval = setInterval(() => {
        if (audioElement.volume > 0) {
            audioElement.volume = Math.max(audioElement.volume - step, 0);
        } else {
            clearInterval(fadeInterval);
            audioElement.pause();
        }
    }, 100);
}
// 音乐播放完时淡出
function fadeOutOnEnd(audioElement, fadeDuration) {
    const fadeStartTime = fadeDuration / 1000;
    const onTimeUpdate = () => {
        const remainingTime = audioElement.duration - audioElement.currentTime;
        if (remainingTime <= fadeStartTime && !audioElement._fadingOut) {
            audioElement._fadingOut = true;  
            fadeOutAudio(audioElement, fadeDuration);
        }
    };
    audioElement.addEventListener('timeupdate', onTimeUpdate);
    audioElement._timeUpdateHandler = onTimeUpdate;
}
// 循环播放音乐
async function playAudioLoop(musicFiles, volume, fadeInDuration, fadeOutDuration, tempFolderPath) {
    if (currentAudio) {
        fadeOutAudio(currentAudio, fadeOutDuration, () => {
            console.log('上一个音频淡出完成');
            currentAudio.removeEventListener('timeupdate', currentAudio._timeUpdateHandler);
        });
    }
    const audioFile = await pickRandomFileFromFolder(musicFiles, tempFolderPath);
    const audio = new Audio(audioFile);
    currentAudio = audio;
    audio.addEventListener('canplaythrough', () => {
        audio.play();
        fadeInAudio(audio, volume, fadeInDuration);
        fadeOutOnEnd(audio, fadeOutDuration);
    });
    audio.addEventListener('ended', () => {
        console.log('音频播放结束');
        if (audioOnPlay) {
            playAudioLoop(musicFiles, volume, fadeInDuration, fadeOutDuration, tempFolderPath);
        } else {
            console.log('停止播放');
        }
    });
    audio.load();
}
// 停止当前音频
function stopCurrentAudio(fadeOutDuration) {
    if (currentAudio) {
        fadeOutAudio(currentAudio, fadeOutDuration, () => {
            console.log('音频已淡出并停止');
            currentAudio = null;
        });
    } else {
        console.log('当前没有音频在播放');
    }
}
//////文件选择部分//////
// 获取文件列表
async function fetchMusicFiles(folderPath) {
    try {
        const musicFilesList = await window.fileAPI.getMusicFiles(folderPath);
        console.log('音乐文件列表:', musicFilesList);
        return musicFilesList;
    } catch (error) {
        console.error('读取音乐文件失败:', error);
    }
};
// 从文件夹中随机选取文件
async function pickRandomFileFromFolder(musicFiles, folderPath) {
    try {
        if (musicFiles.length === 0) {
            console.error('音乐文件夹为空，尝试重新获取音乐文件');
            musicFiles = await fetchMusicFiles(folderPath);
            if (musicFiles.length === 0) {
                throw new Error('文件夹中没有音频文件');
            }
        }
        const randomIndex = Math.floor(Math.random() * musicFiles.length);
        const selectedFile = musicFiles[randomIndex];
        musicFiles.splice(randomIndex, 1);
        console.log('当前列表:', musicFiles);
        return selectedFile;
    } catch (error) {
        console.error('获取音乐文件时出错:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const configJson = await window.fileAPI.readConfig('config.json');
    if (configJson.extension.writingBGM.enable) {
        console.log('writingBGM is enabled');
        const startTime = configJson.extension.writingBGM.startTime;
        const lastingTime = configJson.extension.writingBGM.lasting * 60;
        const folder = configJson.extension.writingBGM.BGMFolder;
        const musicFiles = await fetchMusicFiles(folder);
        const volume = configJson.extension.writingBGM.volume;
        const preCountdownDuration = configJson.extension.writingBGM.preCountdownDuration * 60;
        await startCountdown(startTime, lastingTime, musicFiles, preCountdownDuration, folder, volume);
    }
});

async function directStart() {
    const configJson = await window.fileAPI.readConfig('config.json');
    const lastingTime = configJson.extension.writingBGM.lasting * 60;
    const folder = configJson.extension.writingBGM.BGMFolder;
    const musicFiles = await fetchMusicFiles(folder);
    const tempFolderPath = folder;
    const volume = configJson.extension.writingBGM.volume;
    const preCountdownDuration = configJson.extension.writingBGM.preCountdownDuration * 60;
    await startMainCountdown(lastingTime, musicFiles, tempFolderPath, volume, preCountdownDuration);
}
//directStart();