const widgetService = require('./WidgetService');

// ==================
// CREATE WIDGET
// ==================
exports.createWidget = async (req, res) => {
    try {
        const data = req.body;

        data.image = req.widgetImage || null;

        const widget = await widgetService.create(data);

        res.status(201).json({
            success: true,
            message: 'Widget created successfully',
            data: widget
        });
    } catch (error) {
        console.error('[Create Widget Error]', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================
// GET ALL WIDGETS
// ==================
exports.getAllWidgets = async (req, res) => {
    try {
        const widgets = await widgetService.findAll();
        res.json({
            success: true,
            count: widgets.length,
            data: widgets
        });
    } catch (error) {
        console.error('[Get Widgets Error]', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================
// GET SINGLE WIDGET
// ==================
exports.getWidgetById = async (req, res) => {
    try {
        const widget = await widgetService.findById(Number(req.params.id));

        if (!widget) {
            return res.status(404).json({ success: false, message: 'Widget not found' });
        }

        res.json({ success: true, data: widget });
    } catch (error) {
        console.error('[Get Widget Error]', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getWidgetBySlug = async (req, res) => {
    try {
        const widget = await widgetService.findBySlug(req.params.slug);

        if (!widget) {
            return res.status(404).json({ success: false, message: 'Widget not found' });
        }

        res.json({ success: true, data: widget });
    } catch (error) {
        console.error('[Get Widget Error]', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// ==================
// UPDATE WIDGET
// ==================
exports.updateWidget = async (req, res) => {
    try {
        const widget = await widgetService.update(Number(req.params.id), req.body);
        res.json({
            success: true,
            message: 'Widget updated successfully',
            data: widget
        });
    } catch (error) {
        console.error('[Update Widget Error]', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================
// DELETE WIDGET
// ==================
exports.deleteWidget = async (req, res) => {
    try {
        await widgetService.remove(Number(req.params.id));
        res.json({
            success: true,
            message: 'Widget deleted successfully'
        });
    } catch (error) {
        console.error('[Delete Widget Error]', error);
        res.status(500).json({ success: false, message: error.message });
    }
};