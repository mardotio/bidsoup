from django.urls import path, include
from rest_framework_nested import routers
from django.contrib.auth.views import LoginView
from . import views

router = routers.DefaultRouter()
router.register(r'accounts', views.AccountViewSet)
router.register(r'bids', views.BidViewSet, base_name='bid')
router.register(r'biditems', views.BidItemViewSet, base_name='biditem')
router.register(r'bidtasks', views.BidTaskViewSet, base_name='bidtask')
router.register(r'customers', views.CustomerViewSet)
router.register(r'categories', views.CategoryViewSet, base_name='category')
router.register(r'unittypes', views.UnitTypeViewSet)
router.register(r'users', views.UserViewSet)

accounts_router = routers.NestedSimpleRouter(router, r'accounts', lookup='account')
accounts_router.register(r'bids', views.BidViewSet, base_name='account-bid')

bids_router = routers.NestedSimpleRouter(router, r'bids', lookup='bid')
bids_router.register(r'categories', views.CategoryViewSet, base_name='bid-category')
bids_router.register(r'biditems', views.BidItemViewSet, base_name='bid-biditem')
bids_router.register(r'bidtasks', views.BidTaskViewSet, base_name='bid-bidtask')

category_router = routers.NestedSimpleRouter(router, r'categories', lookup='category')
category_router.register(r'biditems', views.BidItemViewSet, base_name='category-biditem')

urlpatterns = [
    path('login/', views.SessionLoginView.as_view()),
    path('', include(router.urls)),
    path('', include(accounts_router.urls)),
    path('', include(bids_router.urls)),
    path('', include(category_router.urls)),
]
