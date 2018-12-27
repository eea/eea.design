""" Qrcode
"""
from Products.Five.browser import BrowserView
try:
    import qrcode as qrc
    has_qrcode = True
except ImportError:
    has_qrcode = False
from StringIO import StringIO


class QRCode(BrowserView):
    """ Qrcode
    """
    def __call__(self, *args, **kwargs):
        if not has_qrcode:
            return ''
        data = self.context.absolute_url()
        # Add data
        qr = qrc.QRCode(
            version = 1,
            error_correction = qrc.constants.ERROR_CORRECT_H,
            box_size = 2,
            border = 4,
        )
        qr.add_data(data)
        qr.make(fit=True)
        
        # Create an image from the QR Code instance
        pil_img = qr.make_image()
        op = StringIO()
        pil_img.save(op, 'png')
        img = op.getvalue()
        op.close()
        return img