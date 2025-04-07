// Design Tool JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Konva stage and layers
    const stage = new Konva.Stage({
        container: 'frontCanvas',
        width: 800,
        height: 800
    });

    const frontLayer = new Konva.Layer();
    const backLayer = new Konva.Layer();

    stage.add(frontLayer);
    stage.add(backLayer);

    // Canvas state management
    let activeCanvas = 'front';
    let activeLayer = frontLayer;
    let history = {
        front: [],
        back: []
    };
    let historyIndex = {
        front: -1,
        back: -1
    };

    // Tab switching
    const tabs = document.querySelectorAll('.design-tool__tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetCanvas = tab.dataset.tab;
            switchCanvas(targetCanvas);
        });
    });

    function switchCanvas(targetCanvas) {
        // Update active canvas
        activeCanvas = targetCanvas;
        activeLayer = targetCanvas === 'front' ? frontLayer : backLayer;
        
        // Update stage container
        stage.container(`#${targetCanvas}Canvas`);
        
        // Update tab styles
        document.querySelectorAll('.design-tool__tab').forEach(tab => {
            tab.classList.toggle('design-tool__tab--active', tab.dataset.tab === targetCanvas);
        });
        
        // Update canvas visibility
        document.querySelectorAll('.design-tool__canvas').forEach(canvas => {
            canvas.classList.toggle('design-tool__canvas--active', canvas.id === `${targetCanvas}Canvas`);
        });
    }

    // Text Editor Modal
    const textEditorModal = document.querySelector('.text-editor-modal');
    const textEditorForm = document.querySelector('.text-editor__content');

    document.getElementById('addTextBtn').addEventListener('click', () => {
        textEditorModal.classList.add('text-editor-modal--active');
    });

    document.querySelector('.text-editor__close').addEventListener('click', closeTextEditor);

    function closeTextEditor() {
        textEditorModal.classList.remove('text-editor-modal--active');
        textEditorForm.reset();
    }

    textEditorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const text = document.querySelector('.text-editor__textarea').value;
        const fontSize = parseInt(document.getElementById('fontSize').value);
        const fontFamily = document.getElementById('fontFamily').value;
        const fill = document.getElementById('fill').value;
        const align = document.getElementById('align').value;
        
        if (text.trim()) {
            const textNode = new Konva.Text({
                x: 400,
                y: 400,
                text: text,
                fontSize: fontSize,
                fontFamily: fontFamily,
                fill: fill,
                align: align,
                draggable: true
            });
            
            // Center the text
            textNode.x(textNode.x() - textNode.width() / 2);
            textNode.y(textNode.y() - textNode.height() / 2);
            
            activeLayer.add(textNode);
            saveState();
            closeTextEditor();
        }
    });

    // Image Upload
    const imageUpload = document.getElementById('imageUpload');
    const uploadImageBtn = document.getElementById('uploadImageBtn');
    
    uploadImageBtn.addEventListener('click', () => {
        imageUpload.click();
    });
    
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageObj = new Image();
                imageObj.onload = () => {
                    const imageNode = new Konva.Image({
                        x: 400,
                        y: 400,
                        image: imageObj,
                        draggable: true
                    });
                    
                    // Center the image
                    imageNode.x(imageNode.x() - imageNode.width() / 2);
                    imageNode.y(imageNode.y() - imageNode.height() / 2);
                    
                    activeLayer.add(imageNode);
                    saveState();
                };
                imageObj.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Templates
    const templates = document.querySelectorAll('.design-tool__template');
    templates.forEach(template => {
        template.addEventListener('click', () => {
            const templateName = template.dataset.template;
            loadTemplate(templateName);
        });
    });

    async function loadTemplate(templateName) {
        try {
            const response = await fetch(`/assets/templates/${templateName}.json`);
            const template = await response.json();
            
            // Clear current canvas
            activeLayer.destroyChildren();
            
            // Add template elements
            template.elements.forEach(element => {
                if (element.type === 'text') {
                    const textNode = new Konva.Text({
                        x: element.x,
                        y: element.y,
                        text: element.text,
                        fontSize: element.fontSize,
                        fontFamily: element.fontFamily,
                        fill: element.fill,
                        align: element.align,
                        draggable: true
                    });
                    activeLayer.add(textNode);
                }
            });
            
            saveState();
        } catch (error) {
            console.error('Error loading template:', error);
            alert('Failed to load template. Please try again.');
        }
    }

    // Clear Canvas
    const clearCanvasBtn = document.getElementById('clearCanvasBtn');
    clearCanvasBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
            activeLayer.destroyChildren();
            saveState();
        }
    });

    // History Management
    function saveState() {
        const elements = activeLayer.children.map(node => {
            if (node instanceof Konva.Text) {
                return {
                    type: 'text',
                    x: node.x(),
                    y: node.y(),
                    text: node.text(),
                    fontSize: node.fontSize(),
                    fontFamily: node.fontFamily(),
                    fill: node.fill(),
                    align: node.align()
                };
            } else if (node instanceof Konva.Image) {
                return {
                    type: 'image',
                    x: node.x(),
                    y: node.y(),
                    width: node.width(),
                    height: node.height(),
                    image: node.image()
                };
            }
        });
        
        // Remove future states if we're not at the end
        history[activeCanvas] = history[activeCanvas].slice(0, historyIndex[activeCanvas] + 1);
        
        // Add new state
        history[activeCanvas].push(elements);
        historyIndex[activeCanvas]++;
        
        // Limit history size
        if (history[activeCanvas].length > 20) {
            history[activeCanvas].shift();
            historyIndex[activeCanvas]--;
        }
        
        updateHistoryButtons();
    }

    function updateHistoryButtons() {
        document.getElementById('undoBtn').disabled = historyIndex[activeCanvas] < 0;
        document.getElementById('redoBtn').disabled = historyIndex[activeCanvas] >= history[activeCanvas].length - 1;
    }

    document.getElementById('undoBtn').addEventListener('click', () => {
        if (historyIndex[activeCanvas] > 0) {
            historyIndex[activeCanvas]--;
            loadState();
        }
    });

    document.getElementById('redoBtn').addEventListener('click', () => {
        if (historyIndex[activeCanvas] < history[activeCanvas].length - 1) {
            historyIndex[activeCanvas]++;
            loadState();
        }
    });

    function loadState() {
        activeLayer.destroyChildren();
        
        const elements = history[activeCanvas][historyIndex[activeCanvas]];
        elements.forEach(element => {
            if (element.type === 'text') {
                const textNode = new Konva.Text({
                    x: element.x,
                    y: element.y,
                    text: element.text,
                    fontSize: element.fontSize,
                    fontFamily: element.fontFamily,
                    fill: element.fill,
                    align: element.align,
                    draggable: true
                });
                activeLayer.add(textNode);
            } else if (element.type === 'image') {
                const imageNode = new Konva.Image({
                    x: element.x,
                    y: element.y,
                    width: element.width,
                    height: element.height,
                    image: element.image,
                    draggable: true
                });
                activeLayer.add(imageNode);
            }
        });
        
        updateHistoryButtons();
    }

    // Export Design
    const exportButton = document.getElementById('exportDesignBtn');
    exportButton.addEventListener('click', () => {
        const exportModal = document.querySelector('.export-modal');
        const previewImage = exportModal.querySelector('img');
        const downloadLink = exportModal.querySelector('a');
        
        // Create a temporary canvas to combine the background and design
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = stage.width();
        tempCanvas.height = stage.height();
        const tempContext = tempCanvas.getContext('2d');
        
        // Draw the background image
        const backgroundImage = new Image();
        backgroundImage.src = activeCanvas === 'front' ? '/assets/hoodie-front.png' : '/assets/hoodie-back.png';
        backgroundImage.onload = () => {
            tempContext.drawImage(backgroundImage, 0, 0, tempCanvas.width, tempCanvas.height);
            
            // Draw the Konva stage
            const stageDataURL = stage.toDataURL();
            const stageImage = new Image();
            stageImage.onload = () => {
                tempContext.drawImage(stageImage, 0, 0);
                
                // Update preview and download link
                const dataURL = tempCanvas.toDataURL('image/png');
                previewImage.src = dataURL;
                downloadLink.href = dataURL;
                
                // Show modal
                exportModal.classList.add('export-modal--active');
            };
            stageImage.src = stageDataURL;
        };
    });

    // Close Export Modal
    const exportClose = document.querySelector('.export-close');
    exportClose.addEventListener('click', () => {
        document.querySelector('.export-modal').classList.remove('export-modal--active');
    });

    // Order Form
    const orderForm = document.getElementById('hoodieOrderForm');
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        // Add canvas designs
        formData.append('frontDesign', stage.toDataURL());
        switchCanvas('back');
        formData.append('backDesign', stage.toDataURL());
        switchCanvas('front');
        
        try {
            const response = await fetch('/api/submit-design', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                document.querySelector('.success-modal').classList.add('success-modal--active');
            } else {
                throw new Error('Failed to submit design');
            }
        } catch (error) {
            console.error('Error submitting design:', error);
            alert('Failed to submit design. Please try again.');
        }
    });

    // Close Success Modal
    const successModal = document.querySelector('.success-modal');
    const successActions = successModal.querySelectorAll('.success-actions a');
    
    successActions.forEach(action => {
        action.addEventListener('click', () => {
            successModal.classList.remove('success-modal--active');
        });
    });

    // Initialize
    switchCanvas('front');
    updateHistoryButtons();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+Z for undo
        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            document.getElementById('undoBtn').click();
        }
        
        // Ctrl+Y for redo
        if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            document.getElementById('redoBtn').click();
        }
        
        // Delete key to remove selected element
        if (e.key === 'Delete' || e.key === 'Backspace') {
            const selectedElement = activeLayer.findOne(node => node.isSelected());
            if (selectedElement) {
                selectedElement.destroy();
                activeLayer.draw();
                
                // Update elements array
                const index = activeLayer.children.indexOf(selectedElement);
                if (index > -1) {
                    activeLayer.children.splice(index, 1);
                }
                
                // Add to history
                saveState();
            }
        }
    });
    
    // Add selection functionality
    stage.on('click tap', (e) => {
        // If clicked on empty area - remove all selections
        if (e.target === stage) {
            activeLayer.find('Transformer').forEach(transformer => {
                transformer.nodes([]);
            });
            activeLayer.draw();
            return;
        }
        
        // If clicked on a shape
        if (e.target !== stage) {
            const transformer = activeLayer.findOne('Transformer');
            
            if (transformer) {
                // If clicked on a shape that is already selected
                if (transformer.nodes().indexOf(e.target) >= 0) {
                    return;
                }
                
                // Select new shape
                transformer.nodes([e.target]);
            } else {
                // Create new transformer
                const newTransformer = new Konva.Transformer({
                    nodes: [e.target],
                    boundBoxFunc: (oldBox, newBox) => {
                        // Limit resize
                        const minSize = 20;
                        if (newBox.width < minSize || newBox.height < minSize) {
                            return oldBox;
                        }
                        return newBox;
                    }
                });
                activeLayer.add(newTransformer);
            }
            
            activeLayer.draw();
        }
    });
}); 