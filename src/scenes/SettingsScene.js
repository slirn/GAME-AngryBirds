import Phaser from 'phaser';

export class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.add.rectangle(width / 2, height / 2, width, height, 0x87CEEB);
        
        this.add.text(width / 2, 80, '设置', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // 章节选择
        this.add.text(width / 2, 180, '章节选择', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // 搜索框
        this.createSearchBox(width / 2, 220);
        
        this.chaptersPerPage = 4;
        this.levelsPerChapter = 12;
        this.totalChapters = 10; // 暂时设置为10个章节
        this.totalPages = Math.ceil(this.totalChapters / this.chaptersPerPage);
        
        // 从本地存储读取解锁的章节
        this.unlockedChapters = this.getUnlockedChapters();
        
        // 从本地存储读取上次选择的章节
        const storedChapter = localStorage.getItem('selectedChapter');
        this.selectedChapter = storedChapter ? parseInt(storedChapter) : null;
        
        // 确保选择的章节是已解锁的
        if (this.selectedChapter && !this.unlockedChapters.includes(this.selectedChapter)) {
            this.selectedChapter = null;
        }
        
        // 计算当前页面
        if (this.selectedChapter) {
            this.currentPage = Math.ceil(this.selectedChapter / this.chaptersPerPage);
        } else {
            this.currentPage = 1;
        }
        
        this.chapterButtons = [];
        
        this.createChapterButtons();
        this.createNavigationButtons();
        
        // 开始游戏按钮
        this.createStartGameButton();
        
        // 更新开始游戏按钮状态
        this.updateStartGameButton();
        
        // 返回按钮
        this.createButton(width / 2, height - 80, '返回', () => {
            this.scene.start('MenuScene');
        });
    }
    
    getUnlockedChapters() {
        const stored = localStorage.getItem('unlockedChapters');
        if (stored) {
            return JSON.parse(stored);
        } else {
            // 默认只解锁第一章
            return [1];
        }
    }
    
    unlockNextChapter(currentChapterId) {
        const unlocked = this.getUnlockedChapters();
        const nextChapter = currentChapterId + 1;
        
        if (!unlocked.includes(nextChapter)) {
            unlocked.push(nextChapter);
            localStorage.setItem('unlockedChapters', JSON.stringify(unlocked));
            this.unlockedChapters = unlocked;
        }
    }
    
    createChapterButtons() {
        const { width, height } = this.cameras.main;
        
        // 销毁之前的按钮
        this.chapterButtons.forEach(item => {
            if (item.button) item.button.destroy();
            if (item.checkmark) item.checkmark.destroy();
            if (item.lockIcon) item.lockIcon.destroy();
        });
        this.chapterButtons = [];
        
        const startIndex = (this.currentPage - 1) * this.chaptersPerPage + 1;
        const endIndex = Math.min(startIndex + this.chaptersPerPage - 1, this.totalChapters);
        
        for (let i = startIndex; i <= endIndex; i++) {
            const chapter = { id: i, name: `第${i}章` };
            const y = 250 + (i - startIndex) * 80;
            const isUnlocked = this.unlockedChapters.includes(i);
            const button = this.add.rectangle(width / 2, y, 300, 50, isUnlocked ? 0x3498db : 0x7f8c8d)
                .setInteractive({ useHandCursor: isUnlocked });
            
            this.add.text(width / 2, y, chapter.name, {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            // 勾选标记
            const checkmark = this.add.text(width / 2 + 120, y, '✓', {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#00ff00'
            }).setOrigin(0.5);
            checkmark.visible = isUnlocked && this.selectedChapter === chapter.id;
            
            // 锁定图标
            let lockIcon = null;
            if (!isUnlocked) {
                lockIcon = this.add.text(width / 2 + 120, y, '🔒', {
                    fontSize: '24px'
                }).setOrigin(0.5);
            }
            
            if (isUnlocked) {
                button.on('pointerover', () => button.setFillStyle(0x2980b9));
                button.on('pointerout', () => button.setFillStyle(0x3498db));
                button.on('pointerdown', () => {
                    this.selectChapter(chapter.id, checkmark);
                });
            }
            
            this.chapterButtons.push({ button, checkmark, lockIcon, chapter });
        }
    }
    
    createNavigationButtons() {
        const { width, height } = this.cameras.main;
        
        // 销毁之前的导航按钮
        if (this.leftButton) this.leftButton.destroy();
        if (this.rightButton) this.rightButton.destroy();
        
        // 左按钮
        if (this.currentPage > 1) {
            this.leftButton = this.add.rectangle(width / 2 - 200, height - 220, 80, 50, 0x3498db)
                .setInteractive({ useHandCursor: true });
            
            this.add.text(width / 2 - 200, height - 220, '←', {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            this.leftButton.on('pointerover', () => this.leftButton.setFillStyle(0x2980b9));
            this.leftButton.on('pointerout', () => this.leftButton.setFillStyle(0x3498db));
            this.leftButton.on('pointerdown', () => {
                this.currentPage--;
                this.updatePage();
            });
        }
        
        // 右按钮 - 始终显示，因为章节是无限的
        this.rightButton = this.add.rectangle(width / 2 + 200, height - 220, 80, 50, 0x3498db)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width / 2 + 200, height - 220, '→', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        this.rightButton.on('pointerover', () => this.rightButton.setFillStyle(0x2980b9));
        this.rightButton.on('pointerout', () => this.rightButton.setFillStyle(0x3498db));
        this.rightButton.on('pointerdown', () => {
            this.currentPage++;
            this.updatePage();
        });
    }
    
    updatePage() {
        this.createChapterButtons();
        this.createNavigationButtons();
    }
    
    createSearchBox(x, y) {
        const { width } = this.cameras.main;
        
        // 搜索框背景
        const searchBox = this.add.rectangle(x, y, 300, 40, 0xffffff)
            .setInteractive({ useHandCursor: true });
        
        // 搜索提示文字
        const searchText = this.add.text(x, y, '输入章节号搜索', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#999999'
        }).setOrigin(0.5);
        
        // 输入框
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 1;
        input.placeholder = '输入章节号';
        input.style.position = 'absolute';
        input.style.width = '280px';
        input.style.height = '30px';
        input.style.border = 'none';
        input.style.borderRadius = '4px';
        input.style.padding = '0 10px';
        input.style.fontSize = '16px';
        input.style.fontFamily = 'Arial';
        input.style.backgroundColor = 'transparent';
        input.style.color = '#000000';
        
        // 计算屏幕位置
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            const rect = gameContainer.getBoundingClientRect();
            const scale = rect.width / 1280;
            input.style.left = `${rect.left + x * scale - 150 * scale}px`;
            input.style.top = `${rect.top + y * scale - 20 * scale}px`;
            input.style.transform = `scale(${scale})`;
            input.style.transformOrigin = 'top left';
        }
        
        document.body.appendChild(input);
        
        // 搜索按钮
        const searchButton = this.add.rectangle(x + 170, y, 60, 40, 0x3498db)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(x + 170, y, '搜索', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        searchButton.on('pointerover', () => searchButton.setFillStyle(0x2980b9));
        searchButton.on('pointerout', () => searchButton.setFillStyle(0x3498db));
        searchButton.on('pointerdown', () => {
            const chapterId = parseInt(input.value);
            if (chapterId && chapterId > 0) {
                this.goToChapter(chapterId);
            }
        });
        
        // 回车键搜索
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const chapterId = parseInt(input.value);
                if (chapterId && chapterId > 0) {
                    this.goToChapter(chapterId);
                }
            }
        });
        
        // 清理函数
        this.events.on('shutdown', () => {
            if (input.parentNode) {
                input.parentNode.removeChild(input);
            }
        });
    }
    
    goToChapter(chapterId) {
        // 计算目标页面
        this.currentPage = Math.ceil(chapterId / this.chaptersPerPage);
        
        // 更新页面
        this.updatePage();
        
        // 选择该章节
        const chapterButton = this.chapterButtons.find(btn => btn.chapter.id === chapterId);
        if (chapterButton) {
            this.selectChapter(chapterId, chapterButton.checkmark);
        }
    }
    
    selectChapter(chapterId, checkmark) {
        // 取消之前的选择
        if (this.selectedChapter !== null) {
            const previousButton = this.chapterButtons.find(btn => btn.chapter.id === this.selectedChapter);
            if (previousButton) {
                previousButton.checkmark.visible = false;
            }
        }
        
        // 设置新的选择
        this.selectedChapter = chapterId;
        checkmark.visible = true;
        
        // 保存到本地存储
        localStorage.setItem('selectedChapter', chapterId.toString());
        
        // 更新开始游戏按钮状态
        this.updateStartGameButton();
        
        console.log('Selected chapter:', chapterId);
    }
    
    createStartGameButton() {
        const { width, height } = this.cameras.main;
        
        this.startGameButton = this.createButton(width / 2, height - 150, '开始游戏', () => {
            if (this.selectedChapter) {
                // 切换到关卡选择场景，并跳转到对应章节的页面
                this.scene.start('LevelSelectScene', { chapterId: this.selectedChapter });
            }
        });
        
        // 初始状态下按钮禁用
        this.startGameButton.setFillStyle(0x7f8c8d);
        this.startGameButton.disableInteractive();
    }
    
    updateStartGameButton() {
        if (this.selectedChapter) {
            this.startGameButton.setFillStyle(0xe74c3c);
            this.startGameButton.setInteractive({ useHandCursor: true });
        } else {
            this.startGameButton.setFillStyle(0x7f8c8d);
            this.startGameButton.disableInteractive();
        }
    }
    
    createButton(x, y, text, callback) {
        const button = this.add.rectangle(x, y, 200, 60, 0xe74c3c)
            .setInteractive({ useHandCursor: true });
        
        const buttonText = this.add.text(x, y, text, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        button.on('pointerover', () => {
            button.setFillStyle(0xc0392b);
        });
        
        button.on('pointerout', () => {
            button.setFillStyle(0xe74c3c);
        });
        
        button.on('pointerdown', callback);
        
        return button;
    }
}