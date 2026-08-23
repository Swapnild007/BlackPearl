package com.blackpearl.lab

import android.content.Context

/**
 * Small compatibility wrapper so MainActivity can use AlertDialog.Builder
 * without pulling in an additional UI dependency.
 */
class AlertDialog private constructor() {
    class Builder(private val context: Context) {
        private val delegate = android.app.AlertDialog.Builder(context)

        fun setTitle(title: CharSequence): Builder {
            delegate.setTitle(title)
            return this
        }

        fun setMessage(message: CharSequence): Builder {
            delegate.setMessage(message)
            return this
        }

        fun setNegativeButton(text: CharSequence, listener: android.content.DialogInterface.OnClickListener?): Builder {
            delegate.setNegativeButton(text, listener)
            return this
        }

        fun setPositiveButton(text: CharSequence, listener: android.content.DialogInterface.OnClickListener?): Builder {
            delegate.setPositiveButton(text, listener)
            return this
        }

        fun show(): android.app.AlertDialog = delegate.show()
    }
}
