const BasePage = require('./BasePage');

class UIComponentsPage extends BasePage {
  constructor(driver, mode) {
    super(driver, mode);
    this.elevatedBtn = this.byValueKey('elevated_button');
    this.textBtn = this.byValueKey('text_button');
    this.iconBtn = this.byValueKey('icon_button');
    this.switchWidget = this.byValueKey('theme_switch');
    this.dialogBtn = this.byValueKey('open_dialog_button');
    this.bottomSheetBtn = this.byValueKey('open_bottom_sheet');
    this.snackbarBtn = this.byValueKey('trigger_snackbar');
    this.listView = this.byValueKey('scrollable_list_view');
    this.gridView = this.byValueKey('grid_view_container');
    this.cardWidget = this.byValueKey('info_card_item');
  }

  async openDialog() {
    await this.click(this.dialogBtn);
  }

  async openBottomSheet() {
    await this.click(this.bottomSheetBtn);
  }

  async toggleSwitch() {
    await this.click(this.switchWidget);
  }
}

module.exports = UIComponentsPage;
